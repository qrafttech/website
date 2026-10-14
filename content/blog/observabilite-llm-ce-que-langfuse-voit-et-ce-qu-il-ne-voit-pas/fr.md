---
title: "Observabilité LLM : ce que Langfuse voit, et ce qu'il ne voit pas"
slug: observabilite-llm-ce-que-langfuse-voit-et-ce-qu-il-ne-voit-pas
date: 2026-10-22
author: "Nicolas Rouanne"
---

Fin août, on a découvert après coup qu'une seule feature de notre app avait coûté environ 440 $ en quatre jours. Pas d'alerte, et aucun moyen simple de savoir quel client était derrière. On traçait pourtant déjà nos appels LLM dans Langfuse.

C'est le pendant de [notre article sur les evals](https://qraft.tech/blog/les-evals-llm-a-quoi-ca-sert-et-comment-on-les-fait-tourner-avec-langfuse) : les evals vérifient ce qui part en prod, ici on parle de ce qui se passe une fois que c'est en prod. Combien ça coûte, pour qui, et ce qui casse sans prévenir.

## Une génération par appel

Tous les appels LLM de l'app passent par un seul wrapper. Il ouvre une [génération Langfuse](https://langfuse.com/docs/observability/data-model) nommée d'après la feature qui fait l'appel, et écrit en parallèle une ligne dans une table de logs, marquée `failed` si l'appel lève une exception.

```ruby
Langfuse.observe(feature.to_s, as_type: :generation) do |gen|
  gen.model = model
  gen.input = input

  result = yield

  gen.update(model: result.model_id, output: { role: 'assistant', content: result.content })
  gen.usage_details = usage_details(result)
  gen.update_trace(
    user_id: user&.id&.to_s,
    session_id:,
    tags: [feature.to_s],
    metadata: langfuse_metadata(survey:, survey_customer:)
  )
```

Avec ça, on a le coût par feature, par modèle et par jour sans rien faire de plus. C'est une bonne base, mais en creusant le pic de coût, on s'est rendu compte que certains chiffres étaient faux.

## Des chiffres faux mais crédibles

Le premier problème venait du cache. Langfuse calcule le coût de chaque type de token séparément, et on remontait tous les tokens d'entrée au même endroit. Les tokens en cache, qui coûtent 90 % moins cher, étaient donc comptés au prix fort. Sur la feature du pic, 248 millions de tokens d'entrée en une semaine apparaissaient à 467 $, soit 78 % du total. Il suffisait de les déclarer à part :

```ruby
# Langfuse sums the cost of each usage key independently, so cached input tokens must be reported
# apart from the fresh ones — otherwise they are billed at full price instead of the OpenAI cache
# rate. `input_cached_tokens` is the key Langfuse's OpenAI price grid recognises.
def usage_details(result)
  input = result.input_tokens.to_i
  cached = result.cached_tokens.to_i

  {
    input: input - cached,
    input_cached_tokens: cached,
    output: result.output_tokens,
    total: input + result.output_tokens.to_i
  }
end
```

Nos séries de coût d'avant ce correctif étaient surestimées d'environ deux fois.

Le deuxième problème était plus discret. Notre compteur de tokens cherchait l'encodage à partir du nom du modèle, et retombait sur un ancien encodage quand il ne connaissait pas le modèle, ce qui était le cas de toute la nouvelle génération vers laquelle on venait de migrer :

```ruby
@tokenizer ||= Tiktoken.encoding_for_model(tiktoken_model) || Tiktoken.get_encoding('cl100k_base')
```

Pas d'erreur, juste des comptes faux. On fixe maintenant l'encodage (`o200k_base`) au lieu de le deviner.

Et enfin, deux flux internes utilisaient des modèles absents de la grille de prix de Langfuse : ils apparaissaient à 0 $. Depuis, un zéro dans un dashboard de coût nous paraît aussi suspect qu'un pic.

## Le coût par client

Pour savoir qui était derrière le pic, il n'a pas fallu écrire de code. Chaque trace porte en metadata l'identifiant de l'étude concernée, et l'API de métriques de Langfuse sait filtrer dessus, même si elle ne sait pas ventiler les coûts par metadata. Ça fait une requête par étude :

```json
{"column": "metadata", "key": "survey_id", "operator": "=", "value": "<id>", "type": "stringObject"}
```

Ça a suffi pour comprendre ce qui s'était passé. En revanche, les traces portent l'étude et pas le compte client, donc pour savoir qui paie, il faut encore passer par la base.

## Un seuil tout simple

On a ensuite ajouté un seuil, vérifié chaque matin : on regarde tout jour qui dépasse trois fois la moyenne des sept derniers jours, ou 100 $. C'est grossier, mais ça suffit pour l'instant. La première fois qu'il s'est déclenché, un vendredi était à 5,5 fois la moyenne, dont 84 % pour une seule étude. Le coût par appel était normal : c'était une grosse campagne d'interviews lancée l'après-midi, pas un bug. Le seuil sert à ce que quelqu'un aille regarder, pas à poser le diagnostic.

Pour l'instant, c'est une routine qui lit les métriques et fait un rapport chaque matin. Ce n'est pas encore une vraie alerte.

## Ce que Langfuse ne voit pas

C'est probablement ce qu'on a appris de plus utile. Pendant un moment, « 0 erreur dans Langfuse » nous paraissait une bonne nouvelle, mais Langfuse n'enregistre que les appels qui ont produit quelque chose. Plusieurs problèmes n'y sont jamais apparus.

Les pannes du fournisseur, d'abord : un échec DNS sur l'API OpenAI dans un job de fond, un 503 « overloaded » à 2 h du matin. On les a vues dans Sentry, pas dans Langfuse. Pareil pour l'appel refusé par le nouveau modèle à cause d'un paramètre de raisonnement (on le raconte dans l'article sur les evals) : il n'y avait aucune génération à enregistrer.

Il y a eu aussi des résultats perdus mais marqués comme réussis. Après un changement de modèle, 2 à 4 % des rapports d'un juge revenaient sous forme de deux JSON collés. L'erreur de parsing était avalée, le log disait `completed`, et Langfuse montrait un appel parfaitement normal. On lit maintenant uniquement la partie « réponse finale » de la réponse.

Le dernier cas nous a surpris. Notre assistant déclare les tools MCP qu'il a le droit d'utiliser, et OpenAI ignore sans rien dire ceux que le serveur n'expose pas. Un redéploiement de staging a fait disparaître tous les tools pendant quelques heures, et personne ne s'est plaint. On compare maintenant les deux listes à chaque tour :

```ruby
def warn_missing_mcp_tools(item)
  exposed = Array(item['tools']).pluck('name')
  missing = @scope.allowed_tools_for(@user) - exposed
  return if missing.empty?

  Rails.logger.warn("[Assistant] MCP server misses #{@scope.key} tools: #{missing.join(', ')}")
end
```

Ce qu'on en retient : regarder Langfuse et Sentry ensemble, et instrumenter les échecs autant que les succès.

## Ce qui reste

- Une vraie alerte automatique, plutôt qu'un rapport lu le matin.
- Le compte client dans les traces, pour ne plus passer par la base.
- L'API de coûts du fournisseur pour recouper les chiffres, mais elle demande une clé admin que l'app n'a pas.
- Le check des tools manquants se contente de logger un warning : rien ne lève d'erreur, et rien n'arrive dans Langfuse 😅
