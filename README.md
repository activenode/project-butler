# CLI Project Manager

[![Known Vulnerabilities](https://snyk.io/test/github/activenode/project-butler/badge.svg)](https://snyk.io/test/github/activenode/project-butler)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)

| Build status _master_                                                                                                                                          | Build status _develop_                                                                                                                                           |
| -------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [![activenode](https://circleci.com/gh/activenode/project-butler/tree/master.svg?style=shield)](https://circleci.com/gh/activenode/project-butler/tree/master) | [![activenode](https://circleci.com/gh/activenode/project-butler/tree/develop.svg?style=shield)](https://circleci.com/gh/activenode/project-butler/tree/develop) |

# Installation

1. Install package `npm -g install project-butler` and follow the helper to select your shell
2. Reload your shell
3. DONE. You can use it now by calling `p`

# Usage

## Usage as Videos

### Adding and switching between projects

[![asciicast](https://asciinema.org/a/360307.svg)](https://asciinema.org/a/360307)

### Removing aliases and removing projects

[![asciicast](https://asciinema.org/a/360527.svg)](https://asciinema.org/a/360527)

## Usage as Documentation

```
$ p [options] [COMMAND] [args]

Commands:
    p                             | list available projects
    p add                         | adds current directory to projects
    p remove project-name         | removes an alias (not the whole project)
    p cd project-name             | opens the given project (explicit version of `p script-name`)
    p project-name                | opens the given project (shortcut for `p cd`)
    p script-name                 | if inside a project you can trigger a script with this

    p --help                      | show help menu
```

## Why would I choose `p cd project` over `p project`?

Well since `project-butler` is able to run your scripts the following could happen:

You are in your project directory and you call `p start` . If your package.json in that directory contains a `start` script then `project-butler` would NOT search for a global project but run `npm run-script start` instead. In this case you could overgo the behaviour by calling `p cd start` which would explicitly search for a project instead if needed.

# Contribution

There is no official contribution guide yet but feel free to get in touch.
