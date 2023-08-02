import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  ListObjectsV2Command,
} from '@aws-sdk/client-s3';
import dotenv from 'dotenv';
import { Readable } from 'stream';
import fs from 'fs';

dotenv.config();

const REGION: string = 'eu-west-1';
const EMPTY = '';
const DOWNLOAD_SUCCESS = 'DOWNLOAD_SUCCESS';
const a_key = process.env.ACCESS_KEY || '';
const s_key = process.env.SECRET_ACCESS_KEY || '';
const bucketName = process.env.BUCKET_NAME || '';
const filename = process.env.FILENAME || '';
const body = process.env.BODY || '';
const success = process.env.SUCCESS || '';

console.log(a_key, s_key, REGION);

const s3Client = new S3Client({
  region: REGION,
  credentials: {
    accessKeyId: a_key,
    secretAccessKey: s_key,
  },
  endpoint: `https://s3.${REGION}.wasabisys.com`,
});

const transfer = async () => {
  const uploadParam = {
    Bucket: bucketName,
    Key: filename,
    Body: body,
  };

  try {
    const data = await s3Client.send(new PutObjectCommand(uploadParam));
    console.log(success);
  } catch (err) {
    console.log(err);
  }
};

const readFile = async () => {
  const readParam = {
    Bucket: bucketName,
    Key: filename,
  };
  try {
    const data = await s3Client.send(new GetObjectCommand(readParam));
    if (data.Body) {
      let result = '';
      for await (const chunk of data.Body as Readable) {
        result += new TextDecoder().decode(chunk);
      }
      console.log(result); // Here is the file content
    }
  } catch (err) {
    console.log(err);
  }
};

const getFilesList = async () => {
  try {
    const data = await s3Client.send(
      new ListObjectsV2Command({
        Bucket: bucketName,
      })
    );

    if (data.Contents) {
      data.Contents.forEach((file) => {
        console.log(file);
      });
    }
  } catch (err: any) {
    console.log(err.message);
  }
};

const downloadFile = async () => {
  try {
    const data = await s3Client.send(
      new GetObjectCommand({
        Bucket: bucketName,
        Key: filename,
      })
    );

    if (data.Body) {
      const writeStream = fs.createWriteStream(filename);
      const readable = Readable.from(data.Body as Readable);
      readable.pipe(writeStream);
      writeStream.on('finish', () => {
        console.log(DOWNLOAD_SUCCESS);
      });
    }
  } catch (err: any) {
    console.log(err.message);
  }
};

transfer();
readFile();
getFilesList();
downloadFile();
