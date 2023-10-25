const executeQuery = require("../../utils/pool_connections");

const handlerScholarshipType = (req, res) => {
    const query = "SELECT * FROM scholarship_type";
    executeQuery(query, res);

}

module.exports = handlerScholarshipType