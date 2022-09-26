const express = require('express')
const app = express();
const cheerio = require('cheerio')
const request = require('request')

app.all('/', (req, res) => {
    console.log("Just got a request!")
    res.send('HI~')
})
app.listen(process.env.PORT || 3001)


app.get("/test", async (req, res) => {
    const url = 'https://courses.students.ubc.ca/cs/courseschedule?pname=subjarea&tname=subj-course&dept=CPSC&course=110'
    const data = await crawl(url); //hold until response comes back
    res.status(200).json({ data: data })
  })

  
/**
 * Connects and retrieve data from SSC
 * @param {string} url 
 */
 const crawl = async (url) => {
    request(url, (error, response, html) => {
        if (!error && response.statusCode == 200) {
            const $ = cheerio.load(html);
            const table = $('.table.table-striped.section-summary');
            const tbody = table.find('tbody');
            const trs = tbody.children('tr');
            
            return trs.text()
        }
        else {
            return 'ERROR'
        }
    })
}


const wrapData = (tr) => {

}


