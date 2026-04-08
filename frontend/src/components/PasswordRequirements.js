const PasswordRequirements = ({ checkPassword }) => {
    return (
        <>
            <p style={{ color: checkPassword.isLowerCaseLetter ? 'green' : 'red' }}>Lower case letter</p>
            <p style={{ color: checkPassword.isUpperCaseLetter ? 'green' : 'red' }}>Upper case letter</p>
            <p style={{ color: checkPassword.isSpecialSymbol ? 'green' : 'red' }}>Special symbol</p>
            <p style={{ color: checkPassword.isNumber ? 'green' : 'red' }}>Number</p>
            <p style={{ color: checkPassword.isLengthEightOrMore ? 'green' : 'red' }}>Min 8 symbols</p>
        </>
    );
};

export default PasswordRequirements;