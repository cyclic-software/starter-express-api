const emailReg = new RegExp(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
const userNameReg = new RegExp(/^[a-z0-9_\.]+$/);
const passReg = new RegExp(
  /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/
);
const userGenders = ["Male", "Female", "Other"];

module.exports = {
  isValisEmail: (email) => {
    return emailReg.test(email);
  },
  isValisUsername: (username) => {
    return userNameReg.test(username);
  },
  isValisPassword: (password) => {
    return passReg.test(password);
  },
  isValidGender: (gender) => {
    return userGenders.includes(gender);
  },
  userGenders,
};
