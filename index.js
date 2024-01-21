const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const axios = require('axios');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000; // Use the environment variable for Heroku

const hostedDomain = 'http://localhost'; // Replace this with your actual hosted domain

app.use(express.static(path.join(__dirname, '/public/upload')));

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'https://beast-store9.myshopify.com'); // or specific domain
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', '*');
  next();
});

const storage = multer.memoryStorage();
const upload = multer({ storage: storage, fileFilter: fileFilter });

function fileFilter(req, file, cb) {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Not an image!'), false);
  }
}

app.get('/', upload.single('image'), async (req, res) => {
  res.status(200).send('Welcome');
});

app.post('/upload', upload.single('image'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded.' });
  }

  const fileName = 'img.jpg';
  const filePath = path.join(__dirname, '/', fileName);

  fs.writeFile(filePath, req.file.buffer, async (err) => {
    if (err) {
      console.error('Error saving the file:', err);
      return res.status(500).json({ error: 'Error saving the file.' });
    }

    // const downloadLink = `${hostedDomain}/download/${fileName}`;
    const url = hostedDomain + '/' + fileName;
    let shopifyImgUrl = await main(url);

    if (!shopifyImgUrl) {
      return res.status(504).json({ error: 'Error uploading the file.' });
    }
    res.status(200).json({ message: 'File uploaded successfully.', shopifyImgUrl: shopifyImgUrl });
  });
});

app.get('/download/:fileName', (req, res) => {
  const fileName = req.params.fileName;
  const filePath = path.join(__dirname, '/public/upload', fileName);

  if (fs.existsSync(filePath)) {
    res.setHeader('Content-Disposition', `attachment; filename=${fileName}`);
    res.sendFile(filePath);
  } else {
    res.status(404).json({ error: 'File not found.' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});


const apiUrl = 'https://beast-store9.myshopify.com/admin/api/2024-01/graphql.json'; // Replace with your Shopify store name and version
const accessToken = process.env.TOKEN || 'accessToken';

const createFileMutation = `
  mutation fileCreate($files: [FileCreateInput!]!) {
    fileCreate(files: $files) {
      files {
        alt
        createdAt
        fileStatus
        id
      }
    }
  }
`;


const headers = {
  'Content-Type': 'application/json',
  'X-Shopify-Access-Token': accessToken,
};

const main = async (imgSrc) => {
  try {
    // Create file mutation
    const createFileResponse = await axios.post(apiUrl, { query: createFileMutation, variables: {
      files: {
        alt: '',
        contentType: 'IMAGE',
        originalSource: imgSrc
      }
    }}, { headers });

    const createdFile = await createFileResponse.data.data.fileCreate.files;
    // console.log('File created:', createdFile[0].createdAt);

    const retrieveImageQuery = `
      query {
        node(id: "${createdFile[0].id}") {
          ... on MediaImage {
            id
            image {
              id
              url
            }
          }
        }
      }
    `;

    async function makeRequestWithDelay() {
        for (let i = 0; i < 20; i++) {
          try {
            const retrieveFilesResponse = await axios.post(apiUrl, { query: retrieveImageQuery }, { headers });
            const retrievedFiles = retrieveFilesResponse.data.data.node;
            return retrievedFiles.image.url; // Exit the function upon success
          } catch (error) {
            // console.error('Error retrieving files, retrying in 1 second...', error);
            await new Promise(resolve => setTimeout(resolve, 500)); // Wait for 1 second
          }
        }
      
        console.error('Failed to retrieve files after 20 attempts');
    }

    let imgUrl =  await makeRequestWithDelay();
    return imgUrl;

  } catch (error) {
    console.error('Error:', error.response ? error.response.data : error.message);
  }
};
