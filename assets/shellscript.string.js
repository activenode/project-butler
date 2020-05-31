module.exports = `p () {
    RESULT=$(project-butler "$@")

    if [ $? -ne 0 ]; then
        echo "(project-butler) ERROR"
    else
        case "$RESULT" in
            \\#shell*)   eval "$RESULT" ;;
            *)   echo "$RESULT" ;;
        esac
    fi
}
`;
