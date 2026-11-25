---
title: "Alléger les specs RSpec"
slug: alleger-les-specs-rspec
date: 2026-12-03
author: "Nicolas Rouanne"
cover: "gains-fr.png"
excerpt: "Paralléliser RSpec a réduit l'attente, pas le travail. Quatre conventions de specs, mesurées une par une : ce que chacune fait gagner, par test et sur toute la suite."
---

Chez un de nos clients, [paralléliser RSpec](/blog/paralleliser-rspec-sur-github-actions) a fait passer la CI d'une PR de 10 à moins de 5 minutes. Mais paralléliser, comme prendre des machines plus grosses, ne fait que répartir le même travail : on attend moins, la suite n'est pas plus efficace. La cause, ce sont des tests qui font beaucoup plus de travail que ce qu'ils vérifient, et c'est là-dessus qu'on a travaillé.

Et ça se cumule : une factory corrigée accélère tous les specs qui l'utilisent, ceux d'aujourd'hui comme ceux qu'on écrira demain, et un spec écrit avec les bonnes conventions est rapide dès le départ.

L'app de ce client sert à faire des enquêtes en ligne : un compte crée des questionnaires, des gens y répondent, et l'app analyse les réponses. On a appliqué quatre conventions de specs. Chacune a été appliquée seule à la même suite de départ, puis les deux versions ont tourné l'une après l'autre sur une même machine. Les gains ne s'additionnent donc pas, et trois d'entre eux sont des estimations.

![Secondes gagnées sur toute la suite par chaque convention, appliquée seule à la même suite de départ](gains-fr.png "Une barre par convention, chacune contre la même suite de départ : les barres ne s'additionnent pas.")

## Un seul exemple par setup coûteux

Chaque `it` rejoue les `before` et les `let` au-dessus de lui. Quand ce setup importe un fichier, clone un questionnaire ou génère des données, sept `it` d'une ligne font sept imports :

```ruby
describe 'after running' do
  before { result }

  it { expect(result.success).to be true }
  it { expect(created_survey).to have_attributes(name: 'Imported Survey', status: 'complete') }
  it { expect(created_survey.owner).to eq(owner) }
  it { expect(blob).to have_received(:purge_later) }
  # … et trois autres
end
```

On les regroupe dans un seul exemple, qui dit ce qu'il prouve :

```ruby
it 'creates the survey and purges the upload', :aggregate_failures do
  expect(result.success).to be true
  expect(created_survey).to have_attributes(name: 'Imported Survey', status: 'complete')
  expect(created_survey.owner).to eq(owner)
  expect(blob).to have_received(:purge_later)
end
```

Avec [`:aggregate_failures`](https://rspec.info/blog/2015/06/rspec-3-3-has-been-released/), l'exemple ne s'arrête pas au premier `expect` qui échoue : il les exécute tous et rapporte chaque échec, comme le faisaient les sept exemples.

Moins d'exemples, c'est moins de fois le même setup. Le spec de l'import ci-dessus passe de 72 exemples en 26 s à 29 exemples en 8 s :

![Durée de deux fichiers de spec, avant et après le regroupement](aggregate-fr.png "Chaque exemple restant vérifie plus de choses, mais son setup ne tourne qu'une fois.")

Appliqué à 28 fichiers, ça fait passer toute la suite de 666 à 558 s (−16 %).

## `build_stubbed` quand le spec ne lit jamais la base

Beaucoup de specs enregistrent un objet en base alors qu'ils ne le relisent jamais. Par exemple, une validation refuse un camembert pour une question à choix multiple, parce que les réponses n'y font pas 100 %. Le spec n'a besoin que du type de la question, mais il enregistrait toute la question en base :

```ruby
# avant : la question est enregistrée en base
subject(:chart) { build(:results_card, card: create(:card_question_multiple), options: { chart_type: 'pie' }) }

# après : la question est construite en mémoire
subject(:chart) { build(:results_card, card: build_stubbed(:card_question_multiple), options: { chart_type: 'pie' }) }

it { is_expected.not_to be_valid }
```

`build_stubbed` construit l'objet avec un id, comme s'il était enregistré, mais sans toucher la base :

![Temps pour créer un user admin, en base ou en mémoire](stubbed-fr.png "Mesuré sans le compte que la factory ajoutait : on ne compare que l'écriture en base.")

Ce sont quelques millisecondes par objet : sur les 19 fichiers où on l'a appliqué, le gain est estimé à 5 à 10 s, environ 1 % de la suite, trop peu pour ressortir d'une mesure. [FactoryDoctor](https://test-prof.evilmartians.io/guide/profilers/factory_doctor) estimait à 29,8 s tout ce que la suite enregistrait sans jamais le relire.

## Des factories sans cascades

Voici ce que créait un `create(:survey)` :

```ruby
factory :survey do
  account                            # un compte, avec son mailing_account
  association :owner, factory: :user # un user…
end

factory :user do
  transient do
    accounts { [build(:account)] }   # …avec un autre compte, et un autre mailing_account
  end
end
```

Un questionnaire créé dans un spec, c'était donc aussi deux comptes, deux `mailing_account` (les réglages d'envoi d'emails d'un compte) et un owner (le user qui a créé le questionnaire), même quand le spec ne regardait que le questionnaire. Un défaut de factory se paie dans chaque spec qui utilise la factory, et dans chaque factory qui l'associe : 5 540 `mailing_account` étaient créés, dont 18 seulement demandés directement par un spec.

La correction : l'owner n'a plus de compte, le `mailing_account` devient un trait qu'on demande, et les enregistrements enfants réutilisent le questionnaire de leur parent au lieu d'en créer un autre.

```ruby
factory :survey do
  account
  owner { association :user, accounts: [] }
end

factory :account do
  trait :with_mailing_account do
    mailing_account
  end
end
```

Sur toute la suite, ça fait 38 134 enregistrements créés au lieu de 44 135. Le gain propre de cette convention est estimé à une vingtaine de secondes : chaque enregistrement évité ne coûte que quelques millisecondes, mais il y en a 6 000 de moins à chaque passage de la suite.

Le même défaut restait sur les users staff : la factory donnait un compte à chaque user, même aux admins, qui n'en ont pas en production (leur accès vient de leur type). Ce compte coûtait plus que tout ce que `build_stubbed` faisait gagner :

![Temps pour créer un user admin selon la méthode](factory-fr.png "Le compte ajouté par la factory fait plus que doubler le temps de création.")

Les factories des users staff n'ont plus de compte par défaut ; un spec qui en a besoin le passe.

## Ne créer que les enregistrements testés

Certains specs créaient beaucoup plus de données que ce qu'ils vérifiaient. C'est souvent le cas quand le code contient un seuil. Prenons une pagination à 20 éléments par page : pour vérifier qu'il y a bien trois pages, un spec crée 45 éléments. Pourtant, ce qu'il teste, c'est la façon de découper en pages, pas le nombre d'éléments. On peut donc, le temps du spec, passer la taille de page à 2 avec `stub_const` : 5 éléments suffisent alors pour avoir trois pages.

```ruby
# avant : 45 commandes pour obtenir 3 pages de 20
before { create_list(:order, 45) }

# après : des pages de 2, et 5 commandes suffisent pour 3 pages
before do
  stub_const('Order::PER_PAGE', 2)
  create_list(:order, 5)
end

it { expect(Order.page(3).count).to eq(1) }
```

Chez notre client, c'était le même motif : un import coûte 1 crédit par tranche de 1 000 réponses, et le spec en importait 1 500 pour vérifier l'arrondi au crédit supérieur. Avec une tranche ramenée à 2, 3 réponses suffisent. Un autre spec créait 20 réponses par groupe, alors que 4 suffisent à vérifier ses calculs. Son fichier passe de 40 à 9 s :

![Durée d'un fichier de spec, avec 20 puis 4 réponses par groupe](minimal-fr.png "Mêmes 8 exemples, mêmes vérifications.")

Sur les 4 fichiers concernés, le profil de chaque fichier donne un gain d'environ 42 s, une estimation. C'est moins que l'écart entre deux mesures du même code (50 à 100 s) : sur toute la suite, on ne le voit pas, il faut mesurer fichier par fichier.

## Et maintenant

On reprend ces conventions une par une : une petite PR par convention, qu'on relit en quelques minutes.

Le but, c'est que les prochains specs soient efficaces dès qu'on les écrit. Les conventions qu'un outil peut vérifier deviennent des règles de RuboCop, le linter Ruby : un spec qui ne les respecte pas fait échouer la CI. Les autres sont écrites, en phrases simples, dans les instructions que nos agents de code lisent avant d'écrire un spec.

> [!NOTE]
> Les runners `ubuntu-latest` tombent sur des CPU différents, et la même suite peut prendre de 477 à 730 s. Les versions de la suite sont donc comparées sur une seule machine, l'une après l'autre. On suit aussi dans PostHog la somme des temps de chaque fichier de spec, qui monte quand on ajoute des specs, pas quand on ajoute des jobs (voir [Suivre les OKR tech d'une équipe dans PostHog](/blog/suivre-les-okr-tech-d-une-equipe-dans-posthog-depuis-github-actions)).
