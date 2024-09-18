import { credential } from "firebase-admin";
import { initializeApp } from "firebase-admin/app";
import { Firestore } from "firebase-admin/firestore";

initializeApp({credential: credential.applicationDefault()});

const firestore = new Firestore();

const videoCollectionId = 'videos';

export interface Video {
    id?: string,
    uid?: string,
    filename?: string,
    status?: 'processing' | 'processed',
    title?: string,
    description?: string,
    date?: string,
}

/**
 * @param videoId - The id of the video that we will process and display
 */
async function getVideo(videoId: string) {
    const snapshot = await firestore.collection(videoCollectionId).doc(videoId).get();
    return (snapshot.data() as Video) ?? {};
}

/**
 * @param videoId the id of the video that we will display
 * @param video the metadata of the video that we will write to firestore database
 */
export function setVideo(videoId: string, video: Video) {
    return firestore
    .collection(videoCollectionId)
    .doc(videoId)
    .set(video, {merge:true}) // merges data you pass in, so it doesn't delete document each time, just overwrites
}

/**
 * 
 * @param videoId the id of the video we are storing in firestore
 * Determines if video is new
 */
export async function isVideoNew(videoId: string) {
    const video = await getVideo(videoId);
    return video?.status === undefined;
}