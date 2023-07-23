require('dotenv').config()
const { google } = require('googleapis')
const path = require('path');
const speech = require('@google-cloud/speech');

const scopes = "https://www.googleapis.com/auth/analytics.readonly";
const view_id = "278348368";

const jwt = new google.auth.JWT(
    process.env.CLIENT_EMAIL,
    null,
    process.env.PRIVATE_KEY.replace(/\\n/g, "\n"),
    scopes
  );

  async function getViews(){
    try {
      await jwt.authorize();
  
      const response = await google.analytics("v3").data.ga.get({
        auth: jwt,
        ids: "ga:" + view_id,
        "start-date": "30daysAgo",
        "end-date": "today",
        metrics: "ga:pageviews",
      });
  
      console.log(response);
  
    } catch (err) {
       console.log(err);
    }
  };

  async function getTopPosts() {
    try {
      await jwt.authorize();
  
      const response = await google.analytics("v3").data.ga.get({
        auth: jwt,
        ids: "ga:" + view_id,
        "start-date": "2019-01-01",
        "end-date": "today",
        dimensions: "ga:pagePath,ga:pageTitle",
        metrics: "ga:pageviews",
        sort: "-ga:pageviews",
        "max-results": "10",
        filters: "ga:medium==organic",
      });
  
     console.log(response);
    } catch (err) {
     console.log(err);
    }
  };


  
    const client = new speech.SpeechClient({
        keyFilename:path.join(__dirname,"./wolf-ai-393214-ad82055d5e40.json"),
        project_id: "wolf-ai-393214"
    }
    );

    const speechFunction=async (req, res, next)=> {
        const audiofile=req.body.audiofile
        const languageCode=req.body.languageCode

        const config = {
            "encoding": 'ENCODING_UNSPECIFIED',
            "sampleRateHertz":48000,
            "languageCode": languageCode,
    
          };
    
        const audio={
            content:audiofile
        }
        const request = {
            config: config,
            audio: audio,
          };
    
    try{
          const [response] = await client.recognize(request);
          const transcription = response.results
            .map(result => result.alternatives[0].transcript)
            .join('\n');
          res.json(transcription);}
          catch(error){
            console.log(error)
            res.json('failed')
          }
    }
    module.exports = {
       speechFunction
    }