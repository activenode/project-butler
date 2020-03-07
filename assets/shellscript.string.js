module.exports = `p () {
    RESULT=$(project-butler "$@" 2>&1)

    if [ $? -ne 0 ]; then
        echo "(project-butler) ERROR: $RESULT"
    else
        eval "$RESULT"
    fi
}
`;