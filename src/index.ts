import * as functions from 'firebase-functions';
import * as dotenv from 'dotenv';
dotenv.config({ path: `.env.${process.env.NODE_ENV}` });
import app from './app.js';

const runtimeOpts: functions.RuntimeOptions = {
  timeoutSeconds: 300,
  memory: '1GB'
}

export let api = functions.runWith(runtimeOpts).region(`${process.env.FUNCTIONS_REGION}`).https.onRequest(app);