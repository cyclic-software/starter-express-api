const executeQuery = require("../../utils/pool_connections");
const { v4: uuidv4 } = require("uuid");

const handlerAddscholarship = (req, res) => {
  const {
    scholarship_name,
    scholarship_year,
    scholarship_grade,
    description,
    class_type_id,
    start_date,
    end_date,
    scholarship_type_id,
    is_active,
    color_tag,
    scholarship_codition,
    scholarship_qualification,
  } = req.body;
  const scholarship_id = uuidv4();

  const query = `INSERT INTO
  scholarship_info (
       scholarship_id,
      scholarship_name,
      scholarship_year,
      scholarship_grade,
      class_type_id,
      scholarship_type_id,
      start_date,
      end_date,
      description,
      is_active,
      color_tag,
      scholarship_condition,
      scholarship_qualification
  )
VALUES
  (
      '${scholarship_id}',
      '${scholarship_name}',
      '${scholarship_year}',
      '${scholarship_grade}',
      '${class_type_id}',
      '${scholarship_type_id}',
      '${start_date}',
      '${end_date}',
      '${description}',
      '${is_active}',
      '${color_tag}',
      '${scholarship_codition}',
      '${scholarship_qualification}'
  )`;
  executeQuery(query, (data)=>{
    res.send({success:data.rowCount === 1})
  });
};

module.exports = handlerAddscholarship;
