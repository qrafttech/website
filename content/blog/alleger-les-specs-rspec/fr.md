---
title: "Alléger les specs RSpec"
slug: alleger-les-specs-rspec
date: 2026-12-03
author: "Nicolas Rouanne"
cover: "conventions-fr.png"
excerpt: "Paralléliser RSpec a réduit l'attente, pas le travail. Cinq conventions de specs, mesurées une par une, font tourner la même suite 45 % plus vite. La plus rentable est dans les factories : un enregistrement de trop se paie dans chaque exemple qui l'utilise."
---

Chez un de nos clients, [paralléliser RSpec](/blog/paralleliser-rspec-sur-github-actions) a fait passer la CI d'une PR de 10 à moins de 5 minutes. Mais la suite fait toujours le même travail, juste réparti sur 6 processus. Pour qu'elle en fasse moins, il faut des specs qui en font moins.

On a appliqué cinq conventions. Chacune a d'abord été mesurée seule, sur une seule machine : la suite d'origine, puis la suite avec la convention, l'une après l'autre. Ensemble, la suite passe de 489 à 268 s :

![Durée de la suite sur la même machine : specs de main, de la PR, puis de main](conventions-fr.png "Les deux passes de main encadrent la mesure : 1 % d'écart entre elles.")

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

Appliqué à 28 fichiers, ça fait passer la suite de 7 650 à 7 231 exemples, et de 666 à 558 s (−16 %). Le gain se concentre dans les specs qui clonent ou génèrent des données : 22 s pour un seul fichier.

## `build_stubbed` quand le spec ne lit jamais la base

Une policy qui décide selon le type du user n'a pas besoin d'enregistrements en base. `build_stubbed` construit l'objet avec un id, sans `INSERT` :

```ruby
let(:account) { build_stubbed(:account) }
let(:chart_template) { build_stubbed(:chart_template, master_report: build_stubbed(:master_report, account:)) }
let(:user) { build_stubbed(:admin_user) }

it { expect(described_class.new(user, chart_template).update?).to be false }
```

Le gain est faible. [FactoryDoctor](https://test-prof.evilmartians.io/guide/profilers/factory_doctor) estimait à 29,8 s tout ce que la suite créait en base sans jamais le lire ; passer 19 fichiers en `build_stubbed` gagne autour de 1 %.

Et il y a un piège. Dans nos factories, les rôles d'un user sont créés dans un `after(:create)`, que `build_stubbed` ne lance pas. Un user `build_stubbed` n'a donc aucun rôle : un spec qui vérifie qu'un client ne peut pas modifier reste vert même si la policy laisse passer les clients, puisque ce client-là n'a aucun droit. `build_stubbed` est donc réservé aux décisions prises sur le type du user ou de l'enregistrement. Dès qu'une policy lit les rôles, le user est créé.

## Supprimer les exemples qui ne prouvent rien de plus que leur voisin

Dans un request spec, chaque exemple rejoue la requête. Quand un exemple vérifie le corps de la réponse, celui qui vérifie le status de succès à côté ne prouve rien de plus :

```ruby
before { create_freemium }

it('responds created') { expect(response).to have_http_status(:created) } # supprimé
it('returns the account name') { expect(response.parsed_body['name']).to eq('Growth Team') }
```

La règle nomme trois cas : un status de succès à côté d'une assertion sur le corps, un `count` à côté d'un `pluck` ou d'un `match_array` sur la même relation, et une seconde valeur d'entrée qui passe par la même branche du code.

Celle-là n'a pas été mesurée seule : les exemples supprimés sont éparpillés dans toute la suite. Et le critère compte. Dans les contextes qui ne vérifiaient que la base, le status était la seule preuve sur la réponse : environ 110 contextes ont dû le retrouver. Il reste aussi pour les endpoints appelés par un client extérieur (OAuth, webhooks), où le code exact fait partie du contrat.

## Des factories sans cascades

C'est là que la mesure a été la plus parlante. Voici ce que créait un `create(:survey)` :

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
        Rbac::SyncCatalog.call       # recharge tout le catalogue des rôles
        Role.find_by!(key: evaluator.account_role_key)
      end
      user.user_roles.create!(role:, roleable: account)
    end
  end
end
```

Chaque exemple tourne dans une transaction annulée à la fin, rôles compris. Au début d'un exemple, le rôle n'existait donc jamais : chaque exemple qui créait un questionnaire rechargeait tout le catalogue des rôles, pour le compte d'un owner que les specs ne lisaient presque jamais.

Un défaut de factory se paie dans chaque spec qui utilise la factory, et dans chaque factory qui l'associe. Ici, 5 540 `mailing_account` étaient créés, pour 18 lus.

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

Seule, cette convention fait passer la suite de 699 à 574 s (−18 %) : 38 134 enregistrements créés au lieu de 44 135, et la factory `survey` passe de 148 à 40 s sur toute la suite. Mais l'essentiel venait du catalogue rechargé, qu'on a aussi corrigé à part, en une ligne : `config.before(:suite) { Rbac::SyncCatalog.call }`, −27 % à elle seule. Une fois le catalogue chargé une seule fois, la part propre des cascades est estimée à environ 3 %.

Le même défaut restait sur les users staff : la factory donnait un compte à chaque user, même aux admins, qui n'en ont pas en production (leur accès vient de leur type). Ce compte coûtait plus que tout ce que `build_stubbed` faisait gagner :

![Temps pour créer un user admin selon la méthode](factory-fr.png "Le compte ajouté par la factory fait plus que doubler le temps de création.")

Les factories des users staff n'ont plus de compte par défaut ; un spec qui en a besoin le passe.

## Ne créer que les enregistrements testés

Les specs les plus lents créaient des données dont ils ne vérifiaient rien. Pour tester l'arrondi des crédits consommés par un import, un spec importait 1 500 répondants, parce qu'un crédit en couvre 1 000 :

```ruby
# avant
let(:respondent_count) { 1500 }
let(:questions) { [build_parsed_question(cell_values: Array.new(1500, 'a'))] }

# après : 2 répondants par crédit, même arrondi, 3 lignes au lieu de 1 500
let(:respondent_count) { 3 }
let(:questions) { [build_parsed_question(cell_values: %w[a a a])] }
before { stub_const('Credits::Recalculate::Quantitative::RESPONDENTS_PER_BUCKET', 2) }
```

Sur 4 fichiers, la suite gagne environ 42 s : 25 s en passant un rapport de 20 à 4 répondants par profil, 10 s pour l'import ci-dessus. C'est la plus petite des cinq, et elle reste sous l'écart entre deux mesures du même code (50 à 100 s) : seul le profil de chaque fichier la montre.

## Une règle à la fois

On applique maintenant ces conventions une règle à la fois : une PR par règle, relue en quelques minutes. Une règle vérifiable automatiquement devient une règle RuboCop ; les autres vont dans le knowledge des agents, en phrases simples.

La parallélisation n'aura pas à changer : sur la suite allégée, le même bench donnait aussi 3 jobs de 2 processus.

> [!NOTE]
> Les runners `ubuntu-latest` tombent sur des CPU différents, et la même suite peut prendre de 477 à 730 s. Les versions de la suite sont donc comparées sur une seule machine, l'une après l'autre. On suit aussi dans PostHog la somme des temps de chaque fichier de spec, qui monte quand on ajoute des specs, pas quand on ajoute des jobs (voir [Suivre les OKR tech d'une équipe dans PostHog](/blog/suivre-les-okr-tech-d-une-equipe-dans-posthog-depuis-github-actions)).
