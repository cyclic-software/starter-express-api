const axios = require("axios");
const { load } = require("cheerio");
const dayjs = require("dayjs");

/**
 *
 * @param {string} customLink
 * @returns {Promise<{
 *    success: boolean;
 *    tableData: [string, string][];
 *    pdfs: string[];
 *    error?: string;
 * }>}
 */
async function scrapeEWUCalendar(customLink) {
  /**
   * @type {Array<[string, string]>}
   */
  const tableData = [];
  /**
   * @type {Array<string>}
   */
  const pdfs = [];

  const page = await axios.get(customLink).catch((err) => {
    console.log(`Axios error: ${err.message}`);
  });

  if (!page) {
    return { success: false, tableData, pdfs, error: "Page not found" };
  }

  const $ = load(page.data);

  $("table")
    .find("tbody")
    .find("tr")
    .each((_, el) => {
      const date = $(el).children("td").first().find("div").text();
      const event = $(el).children("td").last().find("div").text();
      if (event && date) tableData.push([date, event]);
    });

  $("#downloadCalendar")
    .find(".nav-customcs")
    .children("li")
    .each((_, el) => {
      const pdf = $(el).children("a").attr("href");
      if (pdf) pdfs.push(pdf);
    });

  return { success: true, tableData, pdfs };
}

/**
 *
 * @param {{body: { customLink: string }}} req
 * @param {Express.Response} res
 * @returns {{
 *  season: string;
 *  year: string;
 *  calendar: {
 *    dates: Date[];
 *    formatted: string[];
 *    title: string
 *  }[];
 *  pdfs: string[];
 *  message?: string;
 * }}
 */
const scrapeAndGetDataFormatted = async (req, res) => {
  const { customLink } = req.body;
  const { tableData, pdfs, success, error } = await scrapeEWUCalendar(customLink);
  if (!success) {
    return res.status(404).json({ message: error });
  }

  const semester = customLink.split("/").pop();
  const season = semester?.match(/summer|spring|fall+/gi)?.[0];
  const year = semester?.match(/[0-9]+/gi)?.[0];

  const format = "DD MMMM 'YY";

  /**
   * @type {Array<{ dates: Date[], formatted: string[], title: string }>}
   */
  const datesArray = [];
  tableData.forEach((item) => {
    const dateString = item[0];
    const monthsRegex = /jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec/gi;
    const datesRegex = /[0-9]+/gi;
    const months = dateString.match(monthsRegex);
    const dates = dateString.match(datesRegex);
    if (!months?.length || !dates?.length) return;

    const thisYear = new Date().getFullYear();
    if (months.length === 1 && dates.length === 1) {
      const date = new Date(`${dates[0]} ${months[0]} ${thisYear}`);
      datesArray.push({
        dates: [date],
        formatted: [dayjs(date).format(format)],
        title: item[1],
      });
      return;
    } else if (months.length === 1 && dates.length === 2) {
      const date1 = new Date(`${dates[0]} ${months[0]} ${thisYear}`);
      const date2 = new Date(`${dates[1]} ${months[0]} ${thisYear}`);
      datesArray.push({
        dates: [date1, date2],
        formatted: [dayjs(date1).format(format), dayjs(date2).format(format)],
        title: item[1],
      });
      return;
    } else if (months.length === 2 && dates.length === 2) {
      const date1 = new Date(`${dates[0]} ${months[0]} ${thisYear}`);
      const date2 = new Date(`${dates[1]} ${months[1]} ${thisYear}`);
      datesArray.push({
        dates: [date1, date2],
        formatted: [dayjs(date1).format(format), dayjs(date2).format(format)],
        title: item[1],
      });
      return;
    } else {
      datesArray.push({ dates: [], formatted: [item[0]], title: item[1] });
      return;
    }
  });

  return res.json({ season, year, pdfs, calendar: datesArray });
};

module.exports = { scrapeAndGetDataFormatted };
