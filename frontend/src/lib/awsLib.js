import { Storage } from "aws-amplify";

export async function s3Upload(file) {
  const filename = `${Date.now()}-${file.name}`;
  //Upload the file to the user's folder in S3
  const stored = await Storage.vault.put(filename, file, {
    contentType: file.type,
  });

  return stored.key;
}