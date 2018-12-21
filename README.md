CLI Project Manager
============

# Installation

## 1. Install package
`npm -g install project-butler`

## 2. Make it available in your Bash


```bash
# needs to be in .bash_profile
p () {
  RESULT=$(/Users/david/dev/projects/cli-project-manager/index.js "$@")
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

