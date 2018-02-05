
export const tabActions = {
    change
};

function change(message = 0) {
    return { type: "change", message };
}

