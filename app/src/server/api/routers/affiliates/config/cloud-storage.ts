import { Storage } from "@google-cloud/storage";
import path from "path";
import { env } from "@/env.mjs";

export const uploadFile = async (bucketName: string, tmpFile: string) => {
  try {
    const projectId = "api-front-dashbord";
    const storage = new Storage({
      projectId,
      credentials: {
        client_email: env.GCS_CONFIG_CLIENT_EMAIL,
        private_key: env.GCS_CONFIG_PRIVATE_KEY.replace(/\\n/g, "\n"),
      },
    });
    const options = {
      destination: "",
      // Optional:
      // Set a generation-match precondition to avoid potential race conditions
      // and data corruptions. The request to upload is aborted if the object's
      // generation number does not match your precondition. For a destination
      // object that does not yet exist, set the ifGenerationMatch precondition to 0
      // If the destination object already exists in your bucket, set instead a
      // generation-match precondition using its generation number.
      preconditionOpts: { ifGenerationMatch: 0 },
    };

    const response = await storage.bucket(bucketName).upload(tmpFile, {
      metadata: {
        cacheControl: "public, max-age=31536000",
      },
      destination: path.basename(tmpFile),
    });

    const public_url: string = response[0].metadata.mediaLink;

    return public_url;
  } catch (error) {
    console.log(`Error uploading the file:${error}`);
  }
};

export async function uploadCsvToGcs(
  bucketName: string,
  filePath: string,
  csvData: any
) {
  const storage = new Storage();
  const bucket = storage.bucket(bucketName);
  const file = bucket.file(filePath);

  await file.save(csvData, {
    contentType: "text/csv",
    resumable: false,
    validation: "crc32c",
  });

  console.log(`File ${filePath} uploaded to ${bucketName}.`);
}
