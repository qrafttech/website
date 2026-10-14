# Qraft Website

[![Lint](https://github.com/qrafttech/website/actions/workflows/lint.yml/badge.svg)](https://github.com/qrafttech/website/actions/workflows/lint.yml)

Website for the **Qraft** software engineering company; powered by [_Next.js_](https://nextjs.org/) and [_Tailwind CSS_](https://tailwindcss.com/).

## Development

You need [Docker](https://docs.docker.com/get-docker/): the app runs in a container with the Node version from `.nvmrc`.

```sh
$ make up     # install dependencies and start the development server
$ make url    # print its address
$ make logs   # follow its logs
$ make down   # stop it
```

`make help` lists every command.

## Linting & Styling

### Linting

The project is linted using [_TypeScript_](https://www.typescriptlang.org/) and [_Eslint_](https://eslint.org/).

Run the linter manually to check your changes if needed:

```sh
$ make lint
```

> **Continuous integration** 🤖 will run the linter and **fail the build** if any error is found. 👮‍♀️

### Styling

Code style 💅 is enforced by [_Prettier_](https://prettier.io/) [![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)

We rely on **_Prettier_ default settings**, so no configuration file is needed/present.

Run `prettier` manually to format your files if needed:

```sh
$ make format
```

> **Continuous integration** 🤖 will run the formatter and **fail the build** if any error is found. 👮‍♀️
