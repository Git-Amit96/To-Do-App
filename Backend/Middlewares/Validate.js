const validator = require("validator");

const isValid = ({ email, password }) => {
    const isPasswordValid = validator.isStrongPassword(password);
    const isEmailValid = validator.isEmail(email);
    if (!isPasswordValid) {
        return false;
    }
    if (!isEmailValid) {
        return false;
    }
    return true;

}
module.exports = isValid;
