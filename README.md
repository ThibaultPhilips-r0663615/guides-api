# guides-api

## Purpose of this project

This project was made in order to show future employers my capabilities with node JS, or more specially ExpressJS and the Firebase environment. The project's base concept is a guide service REST API, which makes use of Firebase serverless functions service. Additionally to the functions service, there is also an integration of Google cloud logging, Firebase bucket and Firebase authentication. 

The final goal is to integrate the REST API in both a frontend website (Such as ReactJS, VueJS, etc...) and in a mobile Application (Flutter, React native, etc...). Through these frontend applications, you would be able to manage the resources of the guide service.


## Initial project

- **CRUD Operations** base entities - Label, Language, Address, Guide, Filedata.

- Integration of both a **table based** 'POSTGRESQL' database as well as a **document based** 'MONGODB' based database.

- Able to swap between Google cloud logging and a local file logging system.

- Integration with Firebase Authentication in order to have authorized API paths.

- Image storage is done via Firebase Storage (bucket).

## How to install

### Get the project

Clone / download the project from the remote git repository to your local device. 

### Local file structure

Once you have the repository on your local device, create a (parent) folder on your desired location.

Once created, place the acquired repository into the created parent folder[^1].
[^1]: This step is necessary in order to set up Firebase properly.

### Firebase init

Firebase has an in-depth [explanation](https://firebase.google.com/docs/functions/get-started) of how to set up a Firebase project. 
We advise you to go through the necessary steps before you go further. See below for a more abstract TODO list:

- Go to the before created parent folder

- open a terminal to your liking[^2].
[^2]: We advise you to use git bash (and navigate to the before created parent folder). For those who use visual studio code, you can use the build in terminal.

- Run the following command, this will install Firebase-tools on a global level across all projects[^3]. 
 > npm install -g firebase-tools
 
- After finishing that, login and authenticate the Firebase tools by running the following command[^3].
 > firebase login

- Next, install the Firebase functions service by running the following command[^3].
 > firebase init functions
  
It will first ask if you are sure you want to create the project, press 'Y'.

Next, select the 'create new project', give it a name and a custom unique ID.

Select that you want to install the function service, it will warn that a functions folder already exists and ask you numerous times if you wish to overwrite 
the existing files, keep pressing 'n' till the end.

### Databases

With the downloading of the project and initializing Firebase / Google, we can continue with the databases. You can choose between a traditional table 
based database, ['POSTGRESQL'](https://www.postgresql.org/download/), or the recently more popular document based ['MONGODB'](https://www.mongodb.com/docs/manual/administration/install-community/) database. You can choose which on you use in the project configurations later on.

For installing these databases, we advice you to look on the technologies respective website for a more in-depth guide on how to install their services. After installment, you will need the database url, username, password and database in order to connect to it from the REST API.

### Environment variables

Make a copy of the .env.example file which is present at the root of the downloaded project. Rename it to .env.development, in this file are all the variables needed in order 
to make the project run. The comments present in the file give a more detailed explanation of the possible values that you can insert into the variable.

### NPM

Finally, run the following command to install all the 3rd party depencies[^3].

> npm install


## Closure

To run the project, take a close look at the provided scripts in the package.json folder, which is present at the root of the project. The following command would be the 
most used command in order to run the project in development mode[^3]. 

> npm run serve


[^3]: Be sure that the following commands are run NOT in the parent folder, but in the child folder which contains the originally downloaded repository.


