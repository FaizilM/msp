

export function tabChange(state = 0, action) {

    switch (action.type) {
        case "change":
            return {
                tabIndex: action.message
            };
        default:
            return state
    }

}