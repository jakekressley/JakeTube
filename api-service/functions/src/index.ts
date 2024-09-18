import * as functions from "firebase-functions";
import {initializeApp} from "firebase-admin/app";
import {Firestore} from "firebase-admin/firestore";
import * as logger from "firebase-functions/logger";
import {Storage} from "@google-cloud/storage";
import {onCall} from "firebase-functions/v2/https";

initializeApp();

const firestore = new Firestore();
const storage = new Storage();

const rawVideoBucketName = "jk-yt-clone-raw-videos";

export const createUser = functions.auth.user().onCreate((user) => {
  const userInfo = {
    uid: user.uid,
    email: user.email,
    photoUrl: user.photoURL,
  };

  // if collection or doc doesn't exist firestore automatically creates it
  firestore.collection("users").doc(user.uid).set(userInfo);
  logger.info(`User Created: ${JSON.stringify(userInfo)}`);
  return;
});

export const generateUploadUrl = onCall({maxInstances: 1}, async (request) => {
  // check if the user is authenticated
  if (!request.auth) {
    throw new functions.https.HttpsError(
      "failed-precondition",
      "the function must be called while authenticated"
    );
  }

  const auth = request.auth;
  const data = request.data;
  const bucket = storage.bucket(rawVideoBucketName);

  // generate unique file name
  const fileName = `${auth.uid}-${Date.now()}.${data.fileExtension}`;

  // generate a signed url with the bucket
  const [url] = await bucket.file(fileName).getSignedUrl({
    version: "v4",
    action: "write",
    // user has to start updating the file within 15 minutes
    expires: Date.now() + 15 * 60 * 1000,
  });

  return {url, fileName};
});
