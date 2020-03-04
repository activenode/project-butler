CLI Project Manager
============

[![Known Vulnerabilities](https://snyk.io/test/github/activenode/project-butler/badge.svg)](https://snyk.io/test/github/activenode/project-butler)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)


Build status *master* | Build status *develop* 
--- | --- |
[![Build Status](https://travis-ci.com/activenode/project-butler.svg?branch=master)](https://travis-ci.com/activenode/project-butler) | [![Build Status](https://travis-ci.com/activenode/project-butler.svg?branch=develop)](https://travis-ci.com/activenode/project-butler)  
 | 


## Preamble / Troubleshooting
As many developers are using different node versions it is *highly recommended* that you work with the precompiled version of this project. This will be fetched **automagically** if you run a **Linux** or **Mac** System.

> If you are _not_ running a Linux/Mac system or you want to use the source version instead of the binary version it is then required that you run at least the LTS version from node (`>= v8.9.0`) to not worry about compatibility issues.

# Installation

## 1. Install package
`npm -g install project-butler`

## 2. Make sure to call the installer to make shell calls
`project-butler --install`

## 3. DONE. You can use it now by calling `p`


<p align="center"><img src="demo/_install.gif?raw=true"/></p>

# Usage

```
$ p [options] [COMMAND] [args]

Commands:
    p                       | list available projects
    p add                   | adds current directory to projects
    p remove project-name   | adds current directory to projects
    p project-name          | opens the given project

    p --help                | show help menu
```

<p align="center"><img src="demo/_usage.gif?raw=true"/></p>

# Developer information / FAQ

- Q: Why are you building with 10.9.0 whilst requiring 8.9.0 in your package.json?

    A: There is no code-specific reason. Building the binaries for 10.9.0 is faster.


