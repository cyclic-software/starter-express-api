"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.mailTemplate = void 0;
var mailTemplate = function mailTemplate(email, codeNum) {
  return "\n        <strong>Cafe Small House</strong>\n        <br/>\n        <hr/>\n        <form method=\"post\" action=\"http://localhost:5000/api/users/check\">\n          <p style=\"font-size:25px\">\uB85C\uADF8\uC778 \uBC84\uD2BC\uC744 \uD074\uB9AD\uD574\uC8FC\uC138\uC694</p>\n          <input type=\"hidden\" name=\"email\" value=".concat(email, " />\n          <input type=\"hidden\" name=\"checkEmail\" value=").concat(codeNum, " />\n          <button style=\"color:#0984e3; font-size: 25px;\">\uB85C\uADF8\uC778</button>\n        </form>\n        <br/>\n        <p>\uAC10\uC0AC\uD569\uB2C8\uB2E4</p>\n        <p>&copy; ").concat(new Date().getFullYear(), " Cafe Small House</p>\n        ");
};
exports.mailTemplate = mailTemplate;