---
title: "Utiliser Claude Code pour trier les issues Sentry et les lier à GitHub"
slug: utiliser-claude-code-pour-trier-les-issues-sentry-et-les-lier-a-github
date: 2026-01-27
author: "Nicolas Rouanne"
---

## « Tu peux vérifier ce qui se passe dans Sentry ? »

C'est tout ce que j'ai demandé à Claude Code. Ce qui a suivi était un workflow complet de triage d'incidents—interrogation des issues, catégorisation, et création d'issues GitHub correctement liées—le tout en conversation naturelle.

Voici comment je l'ai configuré et à quoi ressemble le workflow.

## Configurer l'accès Sentry pour Claude

Claude Code n'a pas besoin d'un serveur MCP dédié à Sentry. Il lui faut juste l'accès au CLI Sentry et votre token d'authentification.

J'avais déjà mon token dans `~/.sentryclirc` :

```text
[auth]
token=sntryu_xxx
```

Quand j'ai demandé à Claude de vérifier Sentry, il a découvert ce fichier automatiquement et s'est mis au travail. Il a utilisé une combinaison de :

- `sentry-cli` pour lister les organisations et projets
- Des appels directs à l'API REST pour les requêtes détaillées

```bash
# Claude listant mes orgs
sentry-cli organizations list

# Claude interrogeant les détails d'une issue via l'API
curl -H "Authorization: Bearer $TOKEN" \
  "https://sentry.io/api/0/projects/sante-app/api/issues/?limit=20"
```

Le CLI gère les opérations basiques, mais l'API REST est essentielle pour tout ce qui est analytique—comme obtenir les distributions de tags ou les métadonnées des issues.

## Triage des issues

J'ai demandé à Claude d'analyser toutes les issues de notre projet Sentry. Il a interrogé l'API et m'a retourné une liste catégorisée :

**Issues de test** (du setup initial) :

- `ZeroDivisionError: division by zero` — l'endpoint de test `/sentry-debug`
- `Error: First error` — 10 événements de test

**Issues de configuration** (déjà résolues) :

- `XimiConfigError: Missing XIMI config fields` — erreurs au moment du setup

**Vrais bugs** (nécessitent attention) :

- `TypeError` dans le code de sync Ximi
- `ConnectError` échecs DNS
- `SSL SYSCALL error` déconnexions base de données

**Bruit** (erreurs utilisateur attendues) :

- Erreurs de validation login avec mots de passe vides

Pour les issues de test et config, Claude les a résolues directement via l'API :

```bash
curl -X PUT -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"status": "resolved"}' \
  "https://sentry.io/api/0/organizations/sante-app/issues/API-2/"
```

Trois issues résolues en quelques secondes, sans cliquer dans l'interface.

## Création d'issues GitHub liées

C'est la meilleure partie. Sentry a une intégration GitHub qui crée des liens bidirectionnels entre les issues Sentry et GitHub. Claude a utilisé l'API pour l'exploiter correctement.

D'abord, il a vérifié si l'intégration GitHub était configurée :

```bash
curl -H "Authorization: Bearer $TOKEN" \
  "https://sentry.io/api/0/organizations/sante-app/integrations/"
```

Elle l'était—ID d'intégration `360433`. Puis Claude a créé des issues liées pour chaque vrai bug :

````bash
curl -X POST -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "repo": "sante-app/app",
    "title": "TypeError in _sync_carer_to_ximi",
    "description": "Sentry Issue: [API-4](https://sante-app.sentry.io/issues/90099488/)\n\n```\nTypeError: NoneType object is not subscriptable\n  File \"/app/services/carers.py\", line 137\n```"
  }' \
  "https://sentry.io/api/0/organizations/sante-app/issues/API-4/integrations/360433/"
````

La réponse :

```json
{
  "key": "sante-app/app#317",
  "url": "https://github.com/sante-app/app/issues/317"
}
```

Claude a créé 5 issues GitHub liées en environ 30 secondes. Chacune :

- Pointe vers l'issue Sentry
- Apparaît dans la section "Linked Issues" de Sentry
- Peut auto-résoudre l'issue Sentry quand l'issue GitHub est fermée

## Le workflow

Voici à quoi ressemble maintenant mon triage Sentry :

1. **« Vérifie Sentry »** — Claude interroge toutes les issues et leurs métadonnées
2. **Revoir la catégorisation** — test, config, vrais bugs, ou bruit
3. **Résoudre les non-issues** — Claude marque les issues test/config comme résolues via API
4. **Créer les issues GitHub** — Claude utilise l'API d'intégration Sentry-GitHub
5. **Tout est lié** — liens bidirectionnels, pas de copie manuelle

Le tout en conversation naturelle. Plus de changement de contexte entre l'UI Sentry, GitHub et le terminal.

## Endpoints API clés

Pour référence, voici les endpoints que Claude a utilisés :

| Action | Endpoint |
| --- | --- |
| Lister les issues | `GET /projects/{org}/{project}/issues/` |
| Obtenir les tags d'une issue | `GET /organizations/{org}/issues/{issue}/tags/` |
| Résoudre une issue | `PUT /organizations/{org}/issues/{issue}/` |
| Lister les intégrations | `GET /organizations/{org}/integrations/` |
| Créer une issue liée | `POST /organizations/{org}/issues/{issue}/integrations/{integration_id}/` |

## Ce que j'ai appris

- **L'API REST de Sentry est complète** — tout ce que l'UI fait, on peut le faire via API
- **L'API d'intégration GitHub est la bonne méthode** — crée de vrais liens bidirectionnels, pas juste des URLs collées
- **Le token d'auth dans** **`~/.sentryclirc`** **suffit à Claude** — pas de configuration spéciale requise
- **Le triage devient conversationnel** — « résous les issues de test » est plus rapide que cliquer dans l'UI

---

_Cet article a été écrit après une vraie session de triage avec Claude Code. Cinq issues GitHub créées et liées en moins d'une minute._
