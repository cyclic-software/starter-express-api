var admin = require("firebase-admin");

var serviceAccount = require("./fsw32-platinum-team1-firebase-adminsdk-sbc3l-15d12d3f22.json");

//initialize firebase
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: 'gs://fsw32-platinum-team1.appspot.com'
});

// get the bucket
const storage = admin.storage().bucket();

// upload files
async function uploadFile(path, filename) {
    const uploadResult = await storage.upload(path, {
        destination: filename
    })
}

// download files
async function downloadFile(filename) {
    const downloadResult = await storage.file(filename).getSignedUrl({action: 'read', expires: '2023-12-12'})
    return downloadResult
}

// get default avatar
async function defaultAvatar() {
    return 'https://storage.googleapis.com/fsw32-platinum-team1.appspot.com/avatar/a58b131dc8e33b909ed5f5300?GoogleAccessId=firebase-adminsdk-sbc3l%40fsw32-platinum-team1.iam.gserviceaccount.com&Expires=1702339200&Signature=ee8zUytRhcTh4T%2BelaA6GyH8b88NSt3n2rqKnoEUv9Q5e%2BkbGbaYaZUAB9Y7Jav%2Fklbhk5qFcQDwh8%2B2etcPKgnto2JiseyKHbcZ2VNUjzSQqkDWRRri4F7fnl4P5WjwanhsgbBNoV3x%2FOThQ1fQ%2BEEhuLmcmYjo8OOQfcYbeLDZkvqyGc%2BC2M900tQSU1y3SNyqGncEIGY2qAqsvnaeD43ZhYPZJEDOLmbeEhXbz8Q0WDWGlscGMLZB9LZjygQRI0V2cikZV29l3DJ5Ali7UWUL68JE0ZJuk9awbw8b1uE%2F7%2BWCZJUeEMc1g4fiCmLUv42nWM5lNmY82aCYa0ew6Q%3D%3D'

}

module.exports = {uploadFile, downloadFile, defaultAvatar}