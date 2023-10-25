const executeQuery = require("../../utils/pool_connections");
const { v4: uuidv4 } = require("uuid");

const handlerRegister = (req, res) => {
  const {
    firstname,
    lastname,
    email,
    student_id,
    user_password,
    card_id,
    line_id,
    grade,
    phone,
    is_active,
  } = req.body;
  const user_id = uuidv4();
  const role_id = uuidv4();
  const query = `INSERT INTO
 user_info (
    user_id,
     role_id,
     firstname,
     lastname,
     email,
     student_id,
     user_password,
     card_id,
     line_id,
     grade,
     phone,
     is_active
 )
VALUES
 (
     '${user_id}',
     '${role_id}',
     '${firstname}',
     '${lastname}',
     '${email}',
     '${student_id}',
     '${user_password}',
     '${card_id}',
     '${line_id}',
     '${grade}',
     '${phone}',
     '${is_active}'
 )`;
  executeQuery(query, res);
};

module.exports = handlerRegister;
