const executeQuery = require("../../utils/pool_connections");

const handleclassYearType = (req, res) => {
    const query = "SELECT * FROM class_year_type";
    executeQuery(query, res);

}

module.exports = handleclassYearType