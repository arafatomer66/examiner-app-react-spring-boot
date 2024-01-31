const setInputValue = (name, value) => {
    const elements = document.getElementsByName(name)
    if (elements[0] == null) {
        console.error("Elements can't be null");
        return;
    }
    elements[0].value = value;
}

const getInputValue = (name) => {
    const elements = document.getElementsByName(name)
    if (elements[0] == null) {
        console.error("Elements can't be null");
        return;
    }
    return elements[0].value;
}


export {setInputValue, getInputValue}