const executeQuery = require("../../utils/pool_connections");

const handlerScholarshipType = (req, res) => {
    const query = "SELECT * FROM scholarship_type";
    executeQuery(query, (data)=>{
        res.send({result:data.rows})
    });

}

module.exports = handlerScholarshipType