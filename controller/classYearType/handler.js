const executeQuery = require("../../utils/pool_connections");

const handleclassYearType = (req, res) => {
    const query = "SELECT * FROM class_year_type";
    executeQuery(query, (data)=>{
        res.send({result:data.rows})
    });

}

module.exports = handleclassYearType