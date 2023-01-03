# Qraft Website

[![Lint](https://github.com/qrafttech/website/actions/workflows/lint.yml/badge.svg)](https://github.com/qrafttech/website/actions/workflows/lint.yml)

Website for the **Qraft** software engineering agency; powered by [_Next.js_](https://nextjs.org/) and [_Tailwind CSS_](https://tailwindcss.com/).

## Installation

You need [`node`](https://nodejs.org/en/) and we highly recommend installing it through a _Version Manager_, such as [`nvm`](https://github.com/creationix/nvm). The following will install `node` [LTS](https://nodejs.org/en/about/releases/) and `npm`

```sh
$ brew install nvm
$ nvm install --lts
```

`yarn` is needed to fetch JS dependencies. Use [`brew`](https://brew.sh/) 🍺 to [install it](https://yarnpkg.com/lang/en/docs/install/#mac-stable); use `--ignore-dependencies` to use node's version from `nvm`.

```sh
$ brew install yarn --ignore-dependencies
```

Install the _Javascript_ dependencies

```sh
$ yarn install
```

## Development

Run the project in _development_ mode to start the **_development server_** 👨🏻‍🏭

```sh
$ yarn dev
```

Open a new browser window on [http://localhost:3000](http://localhost:3000) to launch your app ☕️ 👨🏻‍🏭

## Linting & Styling

### Linting

The project is linted using [_TypeScript_](https://www.typescriptlang.org/) and [_Eslint_](https://eslint.org/).

Run the linter manually to check your changes if needed:

```sh
$ yarn lint
```

> **Continuous integration** 🤖 will run the linter and **fail the build** if any error is found. 👮‍♀️

### Styling

Code style 💅 is enforced by [_Prettier_](https://prettier.io/) [![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)

We rely on **_Prettier_ default settings**, so no configuration file is needed/present.

Run `prettier` manually to format your files if needed:

```sh
$ yarn format
```

> **Continuous integration** 🤖 will run the formatter and **fail the build** if any error is found. 👮‍♀️
