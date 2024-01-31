const getQuestionsLength = (questionString) => {
    if (typeof questionString != 'string') return 0;
    const questions = questionString.split(',');
    let length = questions.length;
    if (length!=1) length--;
    return length;
}

export { getQuestionsLength };