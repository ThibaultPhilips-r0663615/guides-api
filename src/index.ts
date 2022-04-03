import * as functions from 'firebase-functions';
import { Application } from 'express';
require('dotenv').config({ path: `.env.${process.env.NODE_ENV}` })
var cors = require('cors')
import * as admin from 'firebase-admin'
import { errorHandler } from './middelware/errorHandler';

// *! SQL IMPORTS
import { createDatabaseConnection } from './repositories/database_sql.utils';
import { SQL_DATABASE_CONFIG } from './config/database.config';

// *! MONGODB IMPORTS
import mongoose from 'mongoose';
import { AddressesSchema } from './mongodb_schemas/address.schema';
import { LanguagesSchema } from './mongodb_schemas/languages.schema';
import { GuidesSchema } from './mongodb_schemas/guide.schema';
import { FileDataSchema } from './mongodb_schemas/fileData.schema';
import { labelsSchema } from './mongodb_schemas/label.schema';


const runtimeOpts: functions.RuntimeOptions = {
  timeoutSeconds: 300,
  memory: '1GB'
}
const app: Application = require('express')();

admin.initializeApp();

app.use(cors())

if (process.env.DATABASE_ENV == 'SQL') {
  createDatabaseConnection(SQL_DATABASE_CONFIG)
    .then(async () => {
      // *! REST FUNCTIONS
      require('./rest/guides/guides.module')(app);
      require('./rest/languages/lanuages.module')(app);
      require('./rest/addresses/addresses.module')(app);
      require('./rest/labels/labels.module')(app);
      require('./rest/extra/extra.module')(app);
      require('./rest/auth/auth.module')(app);

      app.use(errorHandler);

      /*app.post('/create-scream', (req, res) => {
        const newScream = {
          body: req.body.body,
          createdAt: new Date().toISOString()
        }
    
        admin.firestore().collection('screams').add(newScream)
        
          .then((doc) => {
            res.json({ message: `document ${doc.id} has been created` });
          }).catch((err) => res.send(res.json(err)))
      })*/
    })
    .catch((error) => console.log(error));

}
else {
  console.log(process.env.LOGGING_TYPE);
  mongoose.connect(`mongodb://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@${process.env.MONGODB_URL}/${process.env.MONGODB_DB_NAME}`)
    .then(async () => {
      switch (process.env.MONGODB_HIBERNATE?.toLocaleUpperCase()) {
        case 'DROP_AND_CREATE':
          mongoose.model('addresses', AddressesSchema).collection.drop();
          mongoose.model('languages', LanguagesSchema).collection.drop();
          mongoose.model('labels', labelsSchema).collection.drop();
          mongoose.model('guides', GuidesSchema).collection.drop();
          mongoose.model('filedata', FileDataSchema).collection.drop();

          mongoose.model('addresses', AddressesSchema)
          mongoose.model('languages', LanguagesSchema)
          mongoose.model('labels', labelsSchema)
          mongoose.model('guides', GuidesSchema)
          mongoose.model('filedata', FileDataSchema)
          break;
        default:
          mongoose.model('addresses', AddressesSchema)
          mongoose.model('languages', LanguagesSchema)
          mongoose.model('labels', labelsSchema)
          mongoose.model('guides', GuidesSchema)
          mongoose.model('filedata', FileDataSchema)
          break;
      }

      // *! REST FUNCTIONS
      require('./rest/guides/guides.module')(app);
      require('./rest/languages/lanuages.module')(app);
      require('./rest/addresses/addresses.module')(app);
      require('./rest/labels/labels.module')(app);
      require('./rest/extra/extra.module')(app);
      require('./rest/auth/auth.module')(app);

      app.use(errorHandler);
    })
    .catch((error) => console.log(error));
}


exports.api = functions.runWith(runtimeOpts).region(`${process.env.FUNCTIONS_REGION}`).https.onRequest(app);