import {getFunctions, httpsCallable} from "firebase/functions";
import { fileURLToPath } from "url";

const functions = getFunctions();

const generateUploadUrl = httpsCallable(functions, 'generateUploadUrl');

export async function uploadVideo(file: File) {
    const response:any = await generateUploadUrl({
        fileExtension: file.name.split('.').pop()
    });
    // upload the file using the signed url
    await fetch(response?.data?.url, {
        method: "PUT",
        body: file,
        headers: {
            'Content-Type': file.type
        }
    });

    return
}
