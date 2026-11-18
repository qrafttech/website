---
title: "Accélérer RSpec sur GitHub Actions : paralléliser, puis alléger les specs"
slug: accelerer-rspec-sur-github-actions-paralleliser-puis-alleger-les-specs
author: "Nicolas Rouanne"
excerpt: "La suite RSpec d'un de nos produits prenait 11 minutes par PR. Répartie sur 3 jobs de 2 processus, elle en prend 4, pour 2 minutes facturées de plus. Et les conventions de specs en cours la réduisent encore de 45 %."
---

Dans [Ne lancer que les tests du projet modifié](/blog/ne-lancer-que-les-tests-du-projet-modifie-sans-perdre-les-checks-requis), on avait arrêté de lancer RSpec sur les PR qui ne touchent pas l'API Rails. Mais les trois quarts des PR la touchent, et pour elles, rien ne changeait : RSpec tournait sur un seul job et le check requis finissait au bout de 11 minutes environ.

On a fait deux choses. Répartir la suite sur plusieurs runners, c'est mergé. Écrire des specs qui coûtent moins cher, c'est en cours.

## Mesurer sur une seule machine

Les runners `ubuntu-latest` ne tombent pas toujours sur le même CPU : pendant nos mesures, GitHub en a tiré 7 modèles différents. La même suite peut prendre 477 s sur un run et 730 s sur le suivant. Comparer deux runs de CI ne dit donc pas grand-chose.

Pour comparer deux versions de la suite, on les fait tourner dans un même job, l'une après l'autre, avec la base remise à zéro entre deux passes, et on lance la référence au début et à la fin. Si les deux passes de référence sont proches, la machine n'a pas bougé pendant la mesure. Pour comparer des configurations de CI, on fait 10 runs de chaque, et on ne compare que les runs tombés sur le même CPU.

## Paralléliser : 3 jobs de 2 processus

On utilise [`parallel_tests`](https://github.com/grosser/parallel_tests). Il découpe la suite en groupes de fichiers et lance un processus par groupe. Chaque processus a sa propre base de test, grâce à `TEST_ENV_NUMBER` dans `database.yml`, et sa propre base Redis :

```yaml
test:
  url: <%= ENV.fetch('TEST_DATABASE_URL') %><%= ENV['TEST_ENV_NUMBER'] %>
```

Un runner GitHub standard a 2 vCPU, donc on lance 2 processus par job. La suite est coupée en 6 groupes, et chaque job de la matrice en prend 2 :

```yaml
strategy:
  fail-fast: false
  matrix:
    groups: ["1,2", "3,4", "5,6"]
steps:
  # ...
  - name: Prepare database
    run: |
      bin/rails db:schema:load
      psql "$POSTGRES_URL" -c "CREATE DATABASE app_test2 TEMPLATE app_test"

  - name: Run RSpec
    run: |
      bundle exec parallel_rspec -n 6 --only-group ${{ matrix.groups }} \
        --group-by ${{ inputs.runtime-log-run && 'runtime' || 'filesize' }} \
        --test-options '--format progress --format ParallelTests::RSpec::RuntimeLogger --out tmp/parallel_runtime_rspec.log' \
        spec
```

La deuxième base est clonée depuis la première avec `TEMPLATE`, ce qui évite de charger le schéma deux fois.

### Des groupes équilibrés, découpés pareil partout

Pour que les 6 groupes durent à peu près autant, `parallel_tests` a besoin du temps de chaque fichier. Chaque run de `main` publie ce log en artifact, et les PR découpent la suite avec le log du dernier run vert de `main`. Sans log (premier run, artifact expiré), le découpage se fait par taille de fichier.

Les 3 jobs doivent lire le même log : si deux jobs découpent différemment, des fichiers ne tournent nulle part, d'autres tournent deux fois, et la CI reste verte. Dans la première version, chaque job cherchait le log lui-même, et ça pouvait diverger : la recherche lisait les 100 derniers artifacts de toutes les branches, et une PR qui publiait le sien entre le démarrage de deux jobs décalait la liste.

La recherche se fait maintenant une seule fois, dans le job `changes` qui tourne déjà avant les tests pour savoir quels projets ont changé. Il passe le numéro du run aux 3 jobs, qui téléchargent tous ce run-là :

```yaml
- name: Find main's RSpec runtime log
  id: runtime-log
  env:
    GH_TOKEN: ${{ github.token }}
  run: |
    echo "run=$(gh api "repos/$GITHUB_REPOSITORY/actions/artifacts?name=rspec-runtime-log&per_page=100" \
      -q '[.artifacts[] | select(.workflow_run.head_branch == "main" and (.expired | not))] | max_by(.created_at) | .workflow_run.id // empty')" >> "$GITHUB_OUTPUT"
```

Seul `main` publie son log. Côté jobs de test, une étape `actions/download-artifact` avec `run-id` récupère ce run précis.

### Le check requis reste le même

Le ruleset de `main` exige un check `RSpec Tests`. On l'a gardé : c'est un petit job qui attend les 3 jobs de la matrice, échoue si l'un d'eux a échoué, assemble la couverture des 6 processus et, sur `main`, publie le log des temps. Le ruleset n'a pas changé.

### Combien de jobs ?

Plus de jobs, c'est une attente plus courte, mais pas gratuite. GitHub facture chaque job arrondi à la minute supérieure, et chaque job paie son setup (Ruby, gems, Python, base de test), environ 50 s ici. On a mesuré 8 configurations, 10 runs chacune, sur la suite de `main` :

| Config | Job le plus lent (médiane) | Minutes facturées |
|---|---:|---:|
| 1 job | 651 s | 11 |
| 2 jobs × 2 processus | 321 s | 11,5 |
| **3 jobs × 2 processus** | **226 s** | **13** |
| 4 jobs × 1 processus | 232 s | 16 |
| 4 jobs × 2 processus | 198 s | 14,5 |
| 5 jobs × 2 processus | 173 s | 15 |
| 6 jobs × 2 processus | 150 s | 18 |
| 8 jobs × 2 processus | 138 s | 19 |

On s'est donné une règle : on ajoute un job tant que chaque minute facturée en plus fait gagner au moins 20 s d'attente. Passer de 2 × 2 à 3 × 2 gagne 95 s pour 1,5 minute de plus. Passer à 4 × 2 ne gagne que 28 s pour 1,5 minute de plus, donc on s'arrête à 3 × 2.

Deux choses ressortent du tableau. Un processus par job est un mauvais calcul : 4 × 1 est plus lent et plus cher que 3 × 2, parce que le deuxième vCPU de chaque runner ne sert à rien. Et au-delà de 3 jobs, l'arrondi à la minute se joue à peu de chose : sur un run réel en 5 × 2, des jobs ont fini juste après la barre des 3 minutes, et le run a été facturé 18 minutes au lieu des 15 du bench.

### Ce que ça donne

Sur les 10 premiers runs depuis le merge, le job RSpec le plus lent a fini entre 213 et 274 s. Le check requis finit vers 4 minutes 30 au lieu de 11, pour 2 minutes facturées de plus par run, une dizaine de dollars par mois à notre rythme.

Deux tests instables existaient déjà sur `main`, et `parallel_tests` les a rendus plus fréquents. L'un générait un mot de passe aléatoire qui contenait parfois le prénom de l'utilisateur, ce que la validation refuse. L'autre attendait un changement d'id externe que la factory recopiait de l'id du compte : quand le compte sortait avec l'id choisi par le test, rien ne changeait. Avec une base par processus, les ids restent bas, et ça arrive plus souvent. Les deux sont corrigés.

## Alléger les specs

Paralléliser réduit l'attente, pas le travail : la somme des temps de chaque fichier ne bouge pas. Pour ça, il faut des specs qui en font moins. Une PR a écrit des conventions et les a appliquées à toute la suite :

- un setup coûteux est partagé par un seul exemple `:aggregate_failures`, au lieu d'être rejoué par chaque `it` d'une ligne ;
- un spec ne crée que les enregistrements qu'il teste ;
- les factories ne créent plus de cascades d'enregistrements par défaut ;
- `build_stubbed` au lieu de `create` quand le spec ne lit jamais la base ;
- les exemples qui ne prouvent rien de plus que leur voisin sont supprimés (un status 200 à côté d'une assertion sur le corps de la réponse, par exemple).

Mesuré sur une seule machine, la suite passe de 489 s à 268 s : −45 %, pour 1 % d'écart entre les deux passes de référence.

### Trop grosse pour être relue

La PR touchait 641 fichiers, +8 062 / −7 411 lignes. Pour vérifier qu'aucune preuve ne s'était perdue, elle a été auditée par des agents en passes successives. Chaque signalement devait nommer une modification du code qui laisse le spec vert, trois autres agents essayaient de le réfuter, et chaque correction était vérifiée en cassant le code pour voir le spec passer au rouge. 10, puis 9, puis 5 problèmes confirmés, puis 0.

La relecture humaine a quand même trouvé des choses : un user `build_stubbed` n'a pas de rôles, donc une policy qui refuse l'accès restait verte pour une mauvaise raison ; et 41 contextes vérifiaient qu'un enregistrement « n'est pas trouvé » sur une table vide, dont 40 existaient déjà sur `main`. Et une mesure a changé notre lecture d'une des règles. Sur 200 créations, `build_stubbed(:admin_user)` prend 1,9 ms, `create(:admin_user)` sans compte 7 ms, et `create(:admin_user)` 15,5 ms. Les 115 users passés en `build_stubbed` font gagner moins d'une seconde sur toute la suite. Ce qui coûtait, c'était la factory : elle donnait un compte à tous les users, admins compris, alors qu'en production un admin n'en a pas.

On a donc fermé la PR sans la merger, et on reprend autrement :

- une PR par règle, en commençant par les plus simples, pour qu'elle se relise en quelques minutes ;
- quand une règle se vérifie automatiquement, elle devient une règle RuboCop ; sinon, elle va dans le knowledge des agents, écrite simplement ;
- les users de test sont créés comme en production : les clients avec un compte, les admins sans.

Rien n'est encore mergé de ce côté. Le découpage en 3 × 2 n'aura pas à changer : sur la suite allégée, le même bench donnait aussi 3 × 2 (150 s).

## Suivre la durée de la suite

On envoie déjà les durées de CI à PostHog (voir [Suivre les OKR tech d'une équipe dans PostHog](/blog/suivre-les-okr-tech-d-une-equipe-dans-posthog-depuis-github-actions)). Avec les jobs parallèles, la durée du check ne dit plus si la suite grossit. On envoie donc aussi, à chaque run vert de `main`, la somme des temps de chaque fichier de spec : elle monte quand on ajoute des specs, pas quand on ajoute des jobs. Avec, l'écart entre le job le plus rapide et le plus lent, pour voir si le découpage se dégrade, et les minutes facturées par check.
