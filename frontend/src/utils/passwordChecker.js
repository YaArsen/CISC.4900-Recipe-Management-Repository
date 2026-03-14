import { handleChange } from './handleChange';

// Handler function triggered on every change in the 'password' input field.
export const passwordChecker = (e, data, setData, setCheckPassword) => {
    const { value } = e.target;

    setCheckPassword({
        isLowerCaseLetter: /[a-z]/.test(value),
        isUpperCaseLetter: /[A-Z]/.test(value),
        isSpecialSymbol: /[!@#$%^&*(),.?":{}|<>]/.test(value),
        isNumber: /[0-9]/.test(value),
        isLengthEightOrMore: value.length >= 8
    });

    handleChange(e, data, setData);
};