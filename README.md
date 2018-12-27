CLI Project Manager
============

## Preamble / Troubleshooting
As many developers are using different node versions it is *highly recommended* that you work with the precompiled version of this project. This will be fetched **automagically** if you run a **Linux** or **Mac** System.

> If you are _not_ running a Linux/Mac system or you want to use the source version instead of the binary version it is then required that you run at least the LTS version from node (`>= v8.9.0`) to not worry about compatibility issues.

# Installation

## 1. Install package
`npm -g install project-butler`

## 2. Make it available in your Bash


```bash
# needs to be in .bash_profile
p () {
  RESULT=$(project-butler "$@")
  EXEC_TRY=$(eval $RESULT 2>&1)

  if [ "$?" -eq "0" ]; then
#   execution went fine
    eval $RESULT
  else
    echo -e "$RESULT"
  fi
}
```

# Usage

```
$ p [options] [COMMAND] [args]

Commands:
    p                 | list available projects
    p add             | adds current directory to projects
    p project-name    | opens the given project

    p --help          | show help menu
```


# Developer information / FAQ

- Q: Why are you building with 10.9.0 whilst requiring 8.9.0 in your package.json?

    A: There is no code-specific reason. Building the binaries for 10.9.0 is faster.


