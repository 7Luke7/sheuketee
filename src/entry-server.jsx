// @refresh reload
import { createHandler, StartServer } from "@solidjs/start/server";
import mongoose from "mongoose";
import { createClient } from "redis";
import { S3Client } from "@aws-sdk/client-s3";

export const redisClient = createClient();

redisClient.on('error', (err) => {
  console.error('Redis Error:', err);
});

redisClient.connect()

export const s3 = new S3Client({ credentials: {
  accessKeyId: process.env.S3_ACCESS_KEY,
  secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
}, region: process.env.S3_SERVER_REGION })

  const connectDB = async () => {
    try {
      await mongoose.connect('mongodb://127.0.0.1:27017/sheakete', {autoIndex: false});
    } catch (error) {
      console.log(error)
    }
  }
  connectDB()

  export default createHandler(() => (
  <StartServer
    document={({ assets, children, scripts }) => (
      <html lang="en">
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" href="/favicon.ico" />
          {assets}
        </head>
        <body>
          <div id="app">{children}</div>
          {scripts}
        </body>
      </html>
    )}
  />
));
