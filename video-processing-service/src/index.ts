import express from 'express';
import ffmpeg from 'fluent-ffmpeg';
import { convertVideo, deleteProcessedVideo, deleteRawVideo, downloadRawVideo, setupDirectories, uploadProcessedVideo } from './storage';
import { isVideoNew, setVideo } from './firestore';

setupDirectories();

const app = express();
app.use(express.json());

// refactor this at some point
app.post('/process-video', async(req, res) => {
  // Get the bucket and filename from Cloud Pub/Sub
  let data;
  try {
    const message = Buffer.from(req.body.message.data, 'base64').toString('utf8');
    data = JSON.parse(message);
    if (!data.name) {
      throw new Error('Invalid message payload received.')
    }
  } catch (error) {
    console.error(error)
    return res.status(400).send('Bad Request: missing filename.');
  }
  
  // <UID> - <DATA>.<EXTENSION>
  const inputFileName = data.name;
  const outputFileName = `processed-${inputFileName}`;
  const videoId = inputFileName.split('.')[0]

  if (!isVideoNew(videoId)) {
    return res.status(400).send('Bad request: video already processing or processed')
  } else {
    await setVideo(videoId, {
      id: videoId,
      uid: videoId.split("-")[0],
      status: 'processing'
    });
  }

  // download raw video from cloud storage
  await downloadRawVideo(inputFileName);  

  // convert video to 360p
  try {
    await convertVideo(inputFileName, outputFileName);
  } catch (err) {
    // cleanup even if it failed
    await Promise.all([
      deleteRawVideo(inputFileName),
      deleteProcessedVideo(outputFileName)
    ])
    console.error(err);
    return res.status(500).send('Internal Server Error: video processing failed.');
  }


  // upload processed video to cloud storage
  await uploadProcessedVideo(outputFileName)

  setVideo(videoId, {
    status: 'processed',
    filename: outputFileName
  })

  await Promise.all([
    deleteRawVideo(inputFileName),
    deleteProcessedVideo(outputFileName)
  ])

  return res.status(200).send('Video processing complete.');
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
