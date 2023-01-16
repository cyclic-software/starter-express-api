const express = require('express')
const app = express();
const cheerio = require('cheerio')
const request = require('request')
const cors = require("cors")
app.use(
  cors({
    // origin:"https://ubcscheduler.pythonanywhere.com",
    // origin:"https://ubcscheduler.onrender.com",
    origin:"*",
    optionsSuccessStatus: 200,
    methods:["GET"],
  })
)

app.listen(process.env.PORT || 8000)

// ROUTES:
app.all('/', (req, res) => {
    res.send('UBC Course Scheduler API')
})

/**
 * Main endpoint to trigger web crawler, winter courses
 * Use of Directory Example: /api/W/sections?subject=CPSC&number=210&term=1
 */
app.get("/api/W/sections", async (req, res) => {
    const subject = req.query.subject
    const number = req.query.number
    const term = req.query.term;
    const url = `https://courses.students.ubc.ca/cs/courseschedule?pname=subjarea&tname=subj-course&dept=${subject}&course=${number}`
    const data = await crawl(url, term)
    res.status(200).json({ sections: data })
  })

/**
 * Main endpoint to trigger web crawler, summer courses
 * Use of Directory Example: /api/S/sections?subject=CPSC&number=210&term=1
 */
 app.get("/api/S/sections", async (req, res) => {
    const subject = req.query.subject
    const number = req.query.number
    const term = req.query.term;
    //TODO: year needs to change appropriately
    const year = "2022"
    const url = `https://courses.students.ubc.ca/cs/courseschedule?tname=subj-course&course=${number}&sessyr=${year}&sesscd=S&dept=${subject}&pname=subjarea`
    const data = await crawl(url, term)
    res.status(200).json({ sections: data })
  })



// HELPERS:
  
/**
 * Connects and retrieve data from SSC. Main execution function for web scrapping SSC data.
 * @param {string} url 
 */
 const crawl = async (url, term) => {
    let sections = new Array;
    let html;
    let success = false;
    let trial = 50;

    while (!success && trial > 0) {
        try {
            html = await getHTML(url)
            success = true
            trial = 0;
        } catch (e) {
            // if blocked, try again
            success = false;
            trial --;
        }
    }
    const $ = cheerio.load(html);
    const trs = $('.table.table-striped.section-summary tbody tr');
    trs.each((idx, tr) => {
        const newSection = readSectionFromTr($, tr, term)
        if (newSection !== null) {
            sections.push(newSection)
        }
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
                console.log("success")
                resolve(html);
            } else {
                console.log("fail")
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
const readSectionFromTr = ($, tr, userSelectedTerm) => {
    
    const tds = $(tr).children('td')

    //TODO skip the rest, if term != term from Tr
    if (!$(tds[3]).text().includes(userSelectedTerm)) return null;
    
    // parse information from tr element:
    const id = createUUID();
    const status = $(tds[0]).text() === " " ? "Available" : $(tds[0]).text()
    const name = $(tds[1]).text()
    const [subject, course, section] = name.split(" ");
    const activity = $(tds[2]).text()
    const term = $(tds[3]).text()
    const mode = $(tds[4]).text().trim()
    const days = $(tds[6]).text().trimStart()
    const start_time = $(tds[7]).text()
    const end_time = $(tds[8]).text()
    const schedule =  days.split(" ").map(d => 
        (createTimeslot( start_time, end_time, d, term ))
    )
    
    // write in newSection object
    let newSection = new Object
    newSection['id'] = id;
    newSection['status'] = status;
    newSection['name'] = name;
    newSection['subject'] = subject;
    newSection['course'] = course;
    newSection['section'] = section;
    newSection['activity'] = activity;
    newSection['term'] = term;
    newSection['mode'] = mode;
    newSection['schedule'] = schedule;

    return newSection;
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


