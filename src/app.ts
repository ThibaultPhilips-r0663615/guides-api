// require('dotenv').config({ path: `.env.${process.env.NODE_ENV}` })
import cors from 'cors';
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

import guideModule from './rest/guides/guides.module';
import lanuageModule from './rest/languages/lanuages.module';
import addressModule from './rest/addresses/addresses.module';
import labelModule from './rest/labels/labels.module';
import extraModule from './rest/extra/extra.module';
import authModule from './rest/auth/auth.module';
import aLaCarteWalkModule from './rest/aLaCarteWalks/aLaCarteWalks.module'
import './util/admin'

import { Application } from 'express';
import express from 'express'
import { ALaCarteWalksSchema } from './mongodb_schemas/aLaCarteWalk.schema';
let app: Application = express();

// app.use(express.json())

app.use(express.json());
var corsOptions = {
  origin: ["http://localhost", "https://placepreferee-leuven.be", "http://localhost:80", "http://localhost"],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization', 'withcredentials', 'crossdomain', 'refreshToken']
}
app.use(cors(corsOptions))

if (process.env.DATABASE_ENV == 'SQL') {
  console.log('SQL')
  await createDatabaseConnection(SQL_DATABASE_CONFIG);
  // *! REST FUNCTIONS
  guideModule(app);
  aLaCarteWalkModule(app);
  lanuageModule(app);
  addressModule(app);
  labelModule(app);
  extraModule(app);
  authModule(app);

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

}
else {
  console.log('mongodb')
  // let connection = mongoose.createConnection(`mongodb://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@${process.env.MONGODB_URL}/${process.env.MONGODB_DB_NAME}`)
  mongoose.connect(`mongodb://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@${process.env.MONGODB_URL}/${process.env.MONGODB_DB_NAME}`);
  // .then(async () => {
  switch (process.env.MONGODB_HIBERNATE?.toLocaleUpperCase()) {
    case 'DROP_AND_CREATE':
      mongoose.model('addresses', AddressesSchema).collection.drop();
      mongoose.model('languages', LanguagesSchema).collection.drop();
      mongoose.model('labels', labelsSchema).collection.drop();
      mongoose.model('guides', GuidesSchema).collection.drop();
      mongoose.model('filedata', FileDataSchema).collection.drop();
      mongoose.model('aLaCarteWalks', ALaCarteWalksSchema).collection.drop();

      mongoose.model('addresses', AddressesSchema)
      mongoose.model('languages', LanguagesSchema)
      mongoose.model('labels', labelsSchema)
      mongoose.model('guides', GuidesSchema)
      mongoose.model('filedata', FileDataSchema)
      mongoose.model('aLaCarteWalks', ALaCarteWalksSchema)
      break;
    default:
      mongoose.model('addresses', AddressesSchema)
      mongoose.model('languages', LanguagesSchema)
      mongoose.model('labels', labelsSchema)
      mongoose.model('guides', GuidesSchema)
      mongoose.model('filedata', FileDataSchema)
      mongoose.model('aLaCarteWalks', ALaCarteWalksSchema)
      break;
  }
  // }

  // *! REST FUNCTIONS
  guideModule(app);
  aLaCarteWalkModule(app);
  lanuageModule(app);
  addressModule(app);
  labelModule(app);
  extraModule(app);
  authModule(app);

  app.use(errorHandler);
  // })
  // .catch((error) => console.log(error));
}

export default app