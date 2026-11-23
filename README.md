# Qraft Website

[![Lint](https://github.com/qrafttech/website/actions/workflows/lint.yml/badge.svg)](https://github.com/qrafttech/website/actions/workflows/lint.yml)

Website for the **Qraft** software engineering company; powered by [_Next.js_](https://nextjs.org/) and [_Tailwind CSS_](https://tailwindcss.com/).

## Development

Two setups, pick one.

### With Docker

You need [Docker](https://docs.docker.com/get-docker/): the app runs in a container, independent from the `node` installed on your machine.

```sh
$ make up     # install dependencies and start the development server
$ make url    # print its address
$ make logs   # follow its logs
$ make down   # stop it
```

`make help` lists every command.

### Without Docker

You need [`node`](https://nodejs.org/en/), in the version from `.nvmrc`; we highly recommend installing it through a _Version Manager_, such as [`nvm`](https://github.com/nvm-sh/nvm). `nvm install` reads `.nvmrc`; `corepack enable` provides `yarn`.

```sh
$ nvm install
$ corepack enable
$ yarn install
$ yarn dev
```

Open a new browser window on [http://localhost:3000](http://localhost:3000) to launch your app ☕️ 👨🏻‍🏭

## Blog

Articles are Markdown files in `content/blog`, one folder per article, published by a PR that merges itself on the article's date. [CONTRIBUTING.md](CONTRIBUTING.md) has the whole path: folder, front matter, Markdown, images, preview, scheduling.

## Linting & Styling

### Linting

The project is linted using [_TypeScript_](https://www.typescriptlang.org/) and [_Eslint_](https://eslint.org/).

Run the linter manually to check your changes if needed:

```sh
$ make lint    # with Docker
$ yarn lint    # without Docker
```

> **Continuous integration** 🤖 will run the linter and **fail the build** if any error is found. 👮‍♀️

### Styling

Code style 💅 is enforced by [_Prettier_](https://prettier.io/) [![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)

We rely on **_Prettier_ default settings**, so no configuration file is needed/present.

Run `prettier` manually to format your files if needed:

```sh
$ make format  # with Docker
$ yarn format  # without Docker
```

> **Continuous integration** 🤖 will run the formatter and **fail the build** if any error is found. 👮‍♀️
