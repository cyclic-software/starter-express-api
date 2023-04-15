const express = require('express')
const app = express()
app.all('/', (req, res) => {
    console.log("Just got a request!")
    res.send('Yo! lo')
})

const sheets = google.sheets({version: 'v4', auth: oauth2Client});



app.get('/api', (req,res) => {

    try {
        const spreadsheetId = '1yYIGMRGAvolZ9nMGx_U5RlKm5GHEARu59W2CS9Sy_iA';
        const sheetName = 'DASHBOARD';
        const range = 'A1:D10'; // Phạm vi các ô cần lấy giá trị

        sheets.spreadsheets.values.get({
        spreadsheetId: spreadsheetId,
        range: sheetName + '!' + range,
        }, (err, res) => {
        if (err) return console.log(`The API returned an error: ${err}`);
        const rows = res.data.values;
        if (rows.length) {
            console.log('Name, Major:');
            rows.forEach((row) => {
            console.log(`${row[0]}, ${row[1]}`);
            });
        } else {
            console.log('No data found.');
        }
        });
        res.send('OK')
    } catch (error) {
        res.send({messge: error.messge})
    }

})



app.listen(process.env.PORT || 3000)