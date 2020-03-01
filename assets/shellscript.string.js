module.exports = `p () {
    RESULT=$(project-butler "$@")
    EXEC_TRY=$(eval $RESULT 2>&1)

    if [ "$?" -eq "0" ]; then
    #   execution went fine
        eval $RESULT
    else
        echo -e "$RESULT"
    fi
}`;