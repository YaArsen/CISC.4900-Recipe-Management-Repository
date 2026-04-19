const PasswordRequirements = ({ checkPassword }) => {
    return (
        <>
            <p className={`password-requirement ${checkPassword.isLowerCaseLetter ? 'matching' : '' }`}>Lower case letter</p>
            <p className={`password-requirement ${checkPassword.isUpperCaseLetter ? 'matching' : '' }`}>Upper case letter</p>
            <p className={`password-requirement ${checkPassword.isSpecialSymbol ? 'matching' : '' }`}>Special symbol</p>
            <p className={`password-requirement ${checkPassword.isNumber ? 'matching' : '' }`}>Number</p>
            <p className={`password-requirement ${checkPassword.isLengthEightOrMore ? 'matching' : '' }`}>Min 8 symbols</p>
        </>
    );
};

export default PasswordRequirements;