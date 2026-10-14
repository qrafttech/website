---
title: "Construire un pipeline de transcription local sans envoyer un octet dans le cloud"
slug: construire-un-pipeline-de-transcription-local-sans-envoyer-un-octet-dans-le-cloud
date: 2026-05-19
author: "Nicolas Rouanne"
---

J'avais besoin de transcrire des enregistrements sensibles — séances de psy, interviews, échanges qui n'avaient rien à faire chez OpenAI ou Google. Cloud out, donc. Un an plus tard et une douzaine de pivots, le pipeline tient en cinq étages, tous offline une fois les modèles téléchargés.

```text
ffmpeg loudnorm → WhisperX (large-v3, Silero VAD) → wav2vec2 align
  → pyannote diarise → Ollama mistral-nemo:12b correction
```

Repo : [github.com/nicolasrouanne/transcribe](https://github.com/nicolasrouanne/transcribe).

## 0. Pourquoi pas MacWhisper

Avant de coder, j'ai regardé ce qui existait. [MacWhisper](https://goodsnooze.gumroad.com/l/macwhisper) est l'app la plus aboutie côté Mac : GUI propre autour de whisper.cpp, tout local, export `.srt`/`.txt`. Pour transcrire une réunion de temps en temps, c'est probablement le meilleur compromis effort/résultat — et la privacy est garantie pareil, puisque tout tourne sur ta machine.

Ce qui m'a fait partir sur du DIY :

- **Automation.** Je veux piper la transcription dans la suite (LLM de correction, post-processing) sans étape « ouvre l'app, charge le fichier, copie le résultat ». Un script qui produit du JSON canonique permet ça ; une GUI, beaucoup moins.
- **Diarisation propre.** Savoir qui parle quand. La plupart des apps grand public ne le font pas, ou mal. Pour de l'audio à deux voix, c'est ce qui rend la transcription lisible.
- **Contrôle de bout en bout.** Tuner les seuils VAD, swapper le modèle de diarisation, brancher un LLM local, changer le prompt de correction. Une app fermée ferme aussi ces choix.

## 1. Préprocessing : remonter le son

Whisper a un seuil interne en-dessous duquel un segment audio est jeté comme « non-parole ». Sur un enregistrement trop calme, des passages entiers de parole passent sous ce seuil et disparaissent silencieusement de la transcription — aucun message d'erreur, juste des bouts qui manquent.

Sur une séance à `mean_volume -35 dB`, j'ai perdu **14 minutes sur 60** comme ça.

La fix : normalisation EBU R128 ([loudnorm](https://ffmpeg.org/ffmpeg-filters.html#loudnorm)) avant l'ASR, pour remonter tout au-dessus des seuils.

```python
audio_filter = "loudnorm=I=-16:TP=-1.5:LRA=11"
cmd = ["ffmpeg", "-nostdin", "-i", str(path),
       "-af", audio_filter,
       "-f", "s16le", "-ac", "1", "-ar", "16000", "-"]
```

Cible -16 LUFS (broadcast standard), true peak -1.5 dBTP.

## 2. ASR : audio → texte

Le cœur du pipeline. Tout le reste sert à rendre ce texte exploitable.

**v1, whisper.cpp + medium.** Binaire C++, pas de Python, modèle moyen pour tenir sur CPU. Marche bien sur de l'anglais clair, médiocre sur le français parlé.

**Premier mur, les hallucinations.** Sur les passages silencieux, whisper s'enferme dans une boucle auto-renforcée — `*bruit de la porte*` répété sur chaque segment, ou des phrases inventées avec une confiance maximale. Le modèle « voit » du silence, ne sait pas quoi en faire, et brode. Palliatif : un détecteur de parole en amont ([Silero VAD](https://github.com/snakers4/silero-vad)) qui découpe l'audio en fenêtres « parole » / « silence » pour que whisper ne traite que les premières.

**v2, \[WhisperX\](https://github.com/m-bain/whisperX).** Trois raisons :

1. `large-v3` est nettement meilleur que `medium` sur le français (très net sur les noms propres et l'oral)
2. Alignement word-level via wav2vec2 intégré
3. Diarisation pyannote disponible dans la même lib

Les seuils VAD/no_speech sont exposés. Les defaults sont trop conservateurs sur audio bruyant ; je tire vers le bas :

| Paramètre | Défaut | Ma valeur | Effet |
| --- | --- | --- | --- |
| `no_speech_threshold` | 0.6 | **0.3** | Whisper jette moins de segments comme « non-parole » |
| `vad_onset` (Silero) | 0.5 | **0.3** | Le VAD attrape les voix plus calmes |
| `hallucination_silence_threshold` | None | **2.0** | Coupe les boucles quand un silence passe entre les mailles |

Trop bas et whisper transcrit le bruit de fond. À tuner audio par audio.

## 3. Alignement : timestamps au mot près

Par défaut, whisper donne un timestamp par _phrase_. Pour des sous-titres propres et pouvoir cliquer sur un mot pour réécouter le passage, on veut un timestamp par _mot_. C'est ce que fait l'alignement forcé : on connaît le texte, on connaît l'audio, on aligne via un modèle wav2vec2 langue-spécifique.

```python
align_model, metadata = whisperx.load_align_model(
    language_code=detected_lang, device=gpu_device
)
aligned = whisperx.align(result["segments"], align_model, metadata,
                         audio, gpu_device)
```

Précision à ~20 ms près. Sur Apple Silicon, l'étage tourne sur MPS : 1-2 min → ~30s sur 1h d'audio.

## 4. Diarisation : qui parle quand

Whisper donne une suite de phrases sans indication de locuteur. Pour de l'audio à plusieurs voix, c'est inexploitable. La diarisation analyse l'audio brut (pas le texte) pour identifier les changements de voix et coller un `[SPEAKER_00]` / `[SPEAKER_01]` à chaque segment.

```python
pipeline = DiarizationPipeline(
    model_name="pyannote/speaker-diarization-community-1",
    token=token, device=gpu_device,
)
segs = pipeline(audio, min_speakers=2, max_speakers=2)
result = assign_word_speakers(segs, result)
```

[\`pyannote/speaker-diarization-community-1\`](https://huggingface.co/pyannote/speaker-diarization-community-1) tourne en local après téléchargement.

C'est l'étage le plus lent : 30-40 min sur 1h d'audio en CPU, 12-15 min sur MPS. Le plus rentable à porter sur GPU.

## 5. Correction LLM : rattraper les erreurs phonétiques

`large-v3` se trompe : mots inexistants en français, noms propres mal orthographiés, phrases qui n'ont aucun sens isolément. Au début j'éditais à la main, insoutenable sur 1h. La fix : faire relire par un LLM local qui connaît le français et peut reconstruire ce qui était probablement dit.

[Ollama](https://ollama.com/) fait tourner les modèles open-source en local, `mistral-nemo:12b` par défaut.

**Prompt v3, correction contextuelle.** Les v1/v2 corrigeaient segment par segment, en aveugle. v3 demande d'utiliser les lignes voisines :

- noms propres : retrouver l'orthographe via d'autres occurrences dans le contexte
- phrases nonsense : reconstruire ce qui était probablement dit depuis le sens des lignes voisines
- mots incohérents avec le sujet : remplacer par le mot phonétiquement proche qui colle

Avec garde-fous : pas de paraphrase si la phrase est claire, hésitations préservées (`euh`, répétitions), label `[SPEAKER_XX]` jamais touché.

**Cache à trois dimensions.** Le transcript est découpé en chunks de 40 segments, chaque réponse cachée sous :

```text
cache/<safe>/correct/<model>/<prompt-version>/<content-hash>/chunk-NNN.txt
```

Changer de modèle, bumper le `PROMPT_VERSION`, ou re-transcrire (nouveau hash) invalident le cache automatiquement. Sans cette structure, chaque itération sur le prompt obligeait à tout re-tourner.

## 6. Cache : reprendre après crash

5 minutes pour transcrire, 30 pour diariser, 10 de LLM. Perdre tout sur un Ctrl-C est insoutenable — donc pipeline en stages, chacun cachant son résultat.

```text
cache/<safe>/
├── meta.json       # fingerprint audio + params
├── transcribe.json
├── align.json
├── diarize.json
└── correct/<model>/<prompt-version>/<content-hash>/chunk-*.txt
```

Le `fingerprint` (sha256 de `path + size + mtime`) est dans `meta.json`. Si l'audio change au même basename, mismatch détecté, le script aborte. Re-lancer la commande après un crash saute toutes les étapes déjà faites.

## Ce qui reste

**ASR encore sur CPU.** [CTranslate2](https://github.com/OpenNMT/CTranslate2) (backend de faster-whisper, lui-même backend d'ASR de WhisperX) n'a pas de support Metal. Sur 1h d'audio M-series : ~5-10 min pour la transcription. L'étage qu'on ne peut pas encore porter sur GPU.

**PR #2 : pivot mlx-whisper.** [mlx-whisper](https://github.com/ml-explore/mlx-examples/tree/main/whisper) tourne en Metal natif sur Apple Silicon. Modèle distillé `whisper-large-v3-turbo`, ~3-4× plus rapide que `large-v3` avec une perte marginale sur du dialogue clair. La PR remplace faster-whisper purement — l'outil ne tourne qu'en local sur Mac, le fallback CPU n'avait plus de raison d'être.

**Pas de streaming, pas d'UI.** Pipeline batch, deux scripts shell symlinkés. Suffisant pour mon usage.

**Diarisation à 2 speakers hard-codée.** Mes cas (psy/patient, interviewer/interviewé) sont binaires. Pour 3+ speakers il faudra exposer les params en CLI et probablement laisser un humain re-mapper les labels après coup.

## Tous les liens

- Repo : [github.com/nicolasrouanne/transcribe](https://github.com/nicolasrouanne/transcribe)
- [MacWhisper](https://goodsnooze.gumroad.com/l/macwhisper) — l'alternative GUI Mac
- [WhisperX](https://github.com/m-bain/whisperX) — transcription + alignement + diarisation
- [Silero VAD](https://github.com/snakers4/silero-vad) — voice activity detection
- [pyannote](https://github.com/pyannote/pyannote-audio) — speaker diarization
- [Ollama](https://ollama.com/) — LLM local
- [mlx-whisper](https://github.com/ml-explore/mlx-examples/tree/main/whisper) — Metal-native ASR sur Apple Silicon
- [ffmpeg loudnorm](https://ffmpeg.org/ffmpeg-filters.html#loudnorm) — normalisation EBU R128
