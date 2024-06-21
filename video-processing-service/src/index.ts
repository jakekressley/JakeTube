import express from 'express';
import { convertVideo, deleteProcessedVideo, deleteRawVideo, downloadRawVideo, setupDirectories, uploadProcessedVideo } from './storage';

setupDirectories();

const app = express();
app.use(express.json());

app.post('/process-video', async(req, res) => {
    // will only be called from cloud pub/sub message
    let data;
    try {
        const message = Buffer.from(req.body.message.data, 'base64').toString('utf8')
        data = JSON.parse(message);
        if (!data.fileName) {
            throw new Error("Invalid message payload received.")
        }
    } catch (error) {
        console.error(error);
        return res.status(400).send("Bad Request: missing filename.")
    }

    const inputFileName = data.name;
    const outputFileName = `processed=${inputFileName}`;

    //download raw video from Cloud Storage
    await downloadRawVideo(inputFileName)

    // convert video to 360p
    try {
        await convertVideo(inputFileName, outputFileName)
    } catch (err) {
        await Promise.all([
            deleteRawVideo(inputFileName),
            deleteProcessedVideo(outputFileName)
        ])
        console.log(err)
        return res.status(500).send("Internal Server Error: video processing failed.")
    }

    // upload video to Cloud Storage
    uploadProcessedVideo(outputFileName)
    await Promise.all([
        deleteRawVideo(inputFileName),
        deleteProcessedVideo(outputFileName)
    ])

    return res.status(200).send("Processing finished successfully")
})

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})

