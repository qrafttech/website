---
title: "Alléger les specs RSpec"
slug: alleger-les-specs-rspec
date: 2026-12-03
author: "Nicolas Rouanne"
cover: "gains-fr.png"
excerpt: "Paralléliser RSpec a réduit l'attente, pas le travail. Quatre conventions de specs et un correctif d'une ligne, mesurés un par un : ce que chacun fait gagner, par test et sur toute la suite."
---

Chez un de nos clients, [paralléliser RSpec](/blog/paralleliser-rspec-sur-github-actions) a fait passer la CI d'une PR de 10 à moins de 5 minutes. Mais la suite fait toujours le même travail, juste réparti sur 6 processus. Pour qu'elle en fasse moins, il faut des specs qui en font moins.

On a appliqué quatre conventions de specs, et trouvé en chemin un correctif d'une ligne qui rapporte plus que chacune d'elles. Chaque changement a été mesuré seul, sur une seule machine : la suite d'origine, puis la suite avec le changement, l'une après l'autre.

![Secondes gagnées sur toute la suite par chaque amélioration, mesurée seule](gains-fr.png "Chaque barre est mesurée seule : les gains ne s'additionnent pas exactement.")

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

Beaucoup de specs enregistrent un objet en base alors qu'ils ne le relisent jamais. Par exemple, une validation refuse un camembert pour une question à choix multiple, parce que les réponses n'y font pas 100 %. Le spec n'a besoin que du type de la question, mais il l'enregistrait en base :

```ruby
# avant : la question est enregistrée en base
subject(:chart) { build(:results_card, card: create(:card_question_multiple), options: { chart_type: 'pie' }) }

# après : la question est construite en mémoire
subject(:chart) { build(:results_card, card: build_stubbed(:card_question_multiple), options: { chart_type: 'pie' }) }

it { is_expected.not_to be_valid }
```

`build_stubbed` construit l'objet avec un id, comme s'il était enregistré, mais sans toucher la base :

![Temps pour créer un user admin, en base ou en mémoire](stubbed-fr.png "Mesuré sans le compte que la factory ajoutait : on ne compare que l'écriture en base.")

Ce sont quelques millisecondes par objet : sur les 19 fichiers où on l'a appliqué, le gain tourne autour de 1 % de la suite. [FactoryDoctor](https://test-prof.evilmartians.io/guide/profilers/factory_doctor) estimait à 29,8 s tout ce que la suite enregistrait sans jamais le relire.

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
    account_role_key { 'client_edit' }
  end

  after(:create) do |user, evaluator|
    evaluator.accounts.each do |account|
      account.save!
      role = Role.find_by(key: evaluator.account_role_key) || begin
        Rbac::SyncCatalog.call       # on y revient plus bas
        Role.find_by!(key: evaluator.account_role_key)
      end
      user.user_roles.create!(role:, roleable: account)
    end
  end
end
```

Un questionnaire créé dans un spec, c'était donc aussi deux comptes, deux `mailing_account`, un owner et son rôle, même quand le spec ne regardait que le questionnaire. Un défaut de factory se paie dans chaque spec qui utilise la factory, et dans chaque factory qui l'associe : 5 540 `mailing_account` étaient créés, pour 18 lus.

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

Créer un questionnaire passe de 48 à 9 ms, et la suite en crée plus de 4 000 :

![Temps moyen pour créer un questionnaire et un user, avec et sans cascades](cascades-fr.png "Mesuré par FactoryProf sur toute la suite.")

Sur toute la suite, ça fait 38 134 enregistrements créés au lieu de 44 135, et la suite passe de 699 à 574 s (−18 %). La plus grosse part de ces 48 ms ne venait pourtant pas des comptes, mais de la ligne `Rbac::SyncCatalog.call` : c'est la section suivante.

Le même défaut restait sur les users staff : la factory donnait un compte à chaque user, même aux admins, qui n'en ont pas en production (leur accès vient de leur type). Ce compte coûtait plus que tout ce que `build_stubbed` faisait gagner :

![Temps pour créer un user admin selon la méthode](factory-fr.png "Le compte ajouté par la factory fait plus que doubler le temps de création.")

Les factories des users staff n'ont plus de compte par défaut ; un spec qui en a besoin le passe.

## Le catalogue des rôles, chargé une seule fois

Dans l'app, les droits passent par des rôles : client en écriture, client en lecture, admin… Ces rôles et leurs permissions sont des lignes en base, que `Rbac::SyncCatalog` crée toutes d'un coup.

La factory `user` en a besoin pour donner un rôle au user. Elle cherche le rôle en base, et s'il n'y est pas, elle lance toute la synchronisation (le `after(:create)` plus haut). Or chaque exemple RSpec tourne dans une transaction annulée à la fin : tout ce qu'il a créé disparaît, rôles compris. L'exemple suivant repart donc d'une base sans rôles, et son premier user relance la synchronisation complète.

C'est pour ça que créer un questionnaire coûtait si cher : son owner recevait un compte avec un rôle, donc chaque exemple qui créait un questionnaire rechargeait tout le catalogue.

La correction tient en une ligne : synchroniser le catalogue une fois, avant toute la suite, en dehors des transactions. Les rôles sont là pour tous les exemples, et la factory les trouve toujours.

```ruby
# spec/support/rbac_catalog.rb
RSpec.configure do |config|
  config.before(:suite) { Rbac::SyncCatalog.call }
end
```

À elle seule, cette ligne fait passer la suite de 714 à 486 s : c'est le plus gros gain de tout l'article. Une fois le catalogue chargé avant la suite, la part propre des cascades tombe à une vingtaine de secondes.

## Ne créer que les enregistrements testés

Certains specs créaient beaucoup plus de données que ce qu'ils vérifiaient.

Par exemple, un import consomme des crédits : 1 crédit par tranche de 1 000 répondants, arrondi au-dessus. Pour vérifier cet arrondi, il faut dépasser une tranche, donc le spec importait 1 500 répondants et vérifiait que ça coûtait 2 crédits. Mais ce qu'on teste, c'est l'arrondi, pas le volume. Le temps du spec, on ramène la tranche à 2 répondants avec `stub_const` : 3 répondants donnent le même arrondi à 2 crédits.

```ruby
# avant
let(:respondent_count) { 1500 }
let(:questions) { [build_parsed_question(cell_values: Array.new(1500, 'a'))] }

# après : 2 répondants par crédit, même arrondi, 3 lignes au lieu de 1 500
let(:respondent_count) { 3 }
let(:questions) { [build_parsed_question(cell_values: %w[a a a])] }
before { stub_const('Credits::Recalculate::Quantitative::RESPONDENTS_PER_BUCKET', 2) }
```

Même idée ailleurs : un rapport créait 20 répondants par profil, alors que 4 suffisent pour vérifier ce qu'il calcule. Son fichier de spec passe de 40 à 9 s :

![Durée du spec du rapport, avec 20 puis 4 répondants par profil](minimal-fr.png "Mêmes 8 exemples, mêmes vérifications.")

Sur les 4 fichiers concernés, ça fait gagner environ 42 s. C'est moins que l'écart entre deux mesures du même code (50 à 100 s) : sur toute la suite, on ne le voit pas, il faut mesurer fichier par fichier.

## Une règle à la fois

On applique maintenant ces conventions une règle à la fois : une PR par règle, relue en quelques minutes. Une règle vérifiable automatiquement devient une règle RuboCop ; les autres vont dans le knowledge des agents, en phrases simples.

La parallélisation n'aura pas à changer : sur la suite allégée, le même bench donnait aussi 3 jobs de 2 processus.

> [!NOTE]
> Les runners `ubuntu-latest` tombent sur des CPU différents, et la même suite peut prendre de 477 à 730 s. Les versions de la suite sont donc comparées sur une seule machine, l'une après l'autre. On suit aussi dans PostHog la somme des temps de chaque fichier de spec, qui monte quand on ajoute des specs, pas quand on ajoute des jobs (voir [Suivre les OKR tech d'une équipe dans PostHog](/blog/suivre-les-okr-tech-d-une-equipe-dans-posthog-depuis-github-actions)).
