// Handler function triggered on every change in the 'password' input field.
export const passwordChecker = (e, setCheckPassword) => {
    const { value } = e.target;

    setCheckPassword({
        isLowerCaseLetter: /[a-z]/.test(value),
        isUpperCaseLetter: /[A-Z]/.test(value),
        isSpecialSymbol: /[!@#$%^&*(),.?":{}|<>]/.test(value),
        isNumber: /[0-9]/.test(value),
        isLengthEightOrMore: value.length >= 8
    });
};

export const requirements = (checkPassword) => {
    return checkPassword.isLowerCaseLetter
    && checkPassword.isUpperCaseLetter
    && checkPassword.isSpecialSymbol
    && checkPassword.isNumber
    && checkPassword.isLengthEightOrMore;
};