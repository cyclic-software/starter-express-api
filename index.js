const express = require('express')
const app = express();
const cheerio = require('cheerio')
const request = require('request')
const cors = require("cors")
app.use(
  cors({
    // origin:"https://ubcscheduler.pythonanywhere.com",
    origin:"*",
    optionsSuccessStatus: 200,
    methods:["GET"],
  })
)

app.listen(process.env.PORT || 3001)

// ROUTES:
app.all('/', (req, res) => {
    res.send('UBC Course Scheduler API')
})

/**
 * Main endpoint to trigger web crawler 
 * Use of Directory Example: /api/sections?subject=CPSC&number=110'
 */
app.get("/api/sections", async (req, res) => {
    const subject = req.query.subject
    const number = req.query.number
    // const url = `https://courses.students.ubc.ca/cs/courseschedule?tname=subj-course&course=${number}&sessyr=2022&sesscd=W&dept=${subject}&pname=subjarea`
    const url = `https://courses.students.ubc.ca/cs/courseschedule?pname=subjarea&tname=subj-course&dept=${subject}&course=${number}`

    const data = await crawl(url)
    res.status(200).json({ sections: data })
  })


// HELPERS:
  
/**
 * Connects and retrieve data from SSC. Main execution function for web scrapping SSC data.
 * @param {string} url 
 */
 const crawl = async (url) => {
    let sections = new Array;
    const html = await getHTML(url)
    const $ = cheerio.load(html);
    const trs = $('.table.table-striped.section-summary tbody tr');
    trs.each((idx, tr) => {
        let newSection = new Object
        readSectionFromTr($, newSection, tr)
        sections.push(newSection)
    })

    return sections
}

/**
 * Send request to given url and fetch html body then return as promise
 * @param {string} url 
 * @returns 
 */
const getHTML = (url) => {
    return new Promise(function (resolve, reject) {
        request(url, (error, response, html) => {
            if (!error && response.statusCode == 200) {
                resolve(html);
            } else {
                reject(error)
            }
        })
    })
}

/**
 * Given a tr element, read and parse necessary information and write into the tr object
 * @param {Section} newSection 
 * @param {HTMLElement} tr 
 */
const readSectionFromTr = ($, newSection, tr) => {
    const tds = $(tr).children('td')
    
    // parse information from tr element:
    const id = createUUID();
    const status = $(tds[0]).text() === " " ? "Available" : $(tds[0]).text()
    const name = $(tds[1]).text()
    const [subject, course, section] = name.split(" ");
    const activity = $(tds[2]).text()
    const term = $(tds[3]).text()
    const days = $(tds[6]).text().trimStart()
    const start_time = $(tds[7]).text()
    const end_time = $(tds[8]).text()
    const schedule =  days.split(" ").map(d => 
        (createTimeslot( start_time, end_time, d, term ))
    )
    
    // write in newSection object
    newSection['id'] = id;
    newSection['status'] = status;
    newSection['name'] = name;
    newSection['subject'] = subject;
    newSection['course'] = course;
    newSection['section'] = section;
    newSection['activity'] = activity;
    newSection['term'] = term;
    newSection['schedule'] = schedule;
}

/**
 * Creates new timeslot given startTime, endTime, day and term
 */
const createTimeslot = (startTime, endTime, day, term) => {
    let startArr = startTime.split(":").map((s) => parseInt(s));
    let endArr = endTime.split(":").map((s) => parseInt(s));
    let nstart = (startArr[0]*60)+startArr[1];
    let nend = (endArr[0]*60)+endArr[1];
    return {start_time: nstart, end_time: nend, day:day, term:term};
}

/**
 * Creates UUID, universal unique ID. This becomes id for each section
 * @returns 
 */
const createUUID = () => {
    let dt = new Date().getTime();
    let uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        let r = (dt + Math.random()*16)%16 | 0;
        dt = Math.floor(dt/16);
        return (c=='x' ? r :(r&0x3|0x8)).toString(16);
    });
    return uuid;
  }


