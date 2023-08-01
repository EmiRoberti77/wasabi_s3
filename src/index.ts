import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import dotenv from 'dotenv';

dotenv.config();

const REGION: string = 'eu-west-1';
const a_key = process.env.ACCESS_KEY || '';
const s_key = process.env.SECRET_ACCESS_KEY || '';

console.log(a_key, s_key, REGION);

const s3Client = new S3Client({
  region: REGION,
  credentials: {
    accessKeyId: a_key,
    secretAccessKey: s_key,
  },
  endpoint: `https://s3.${REGION}.wasabisys.com`,
});

const uploadParam = {
  Bucket: 'sample-emi',
  Key: 'hello2.txt',
  Body: 'hello emi',
};

const transfer = async () => {
  try {
    const data = await s3Client.send(new PutObjectCommand(uploadParam));
    console.log('data uploaded');
  } catch (err) {
    console.log(err);
  }
};

transfer();
