Brandeis University

COSI-103A-1: Fundamentals of Software Engineering

Creative Programming Assignment 02 - Web Apps

Student: James Kong

Video Demo: https://drive.google.com/file/d/1oYrDroTcjoUo33e31YQywNpgia88wc1V/view?usp=sharing

This project is a diary entry drive application. Users can enter in diary entries and the website will hold their entries in the mongoDB database. They can also delete entries. The website is built off of the express.js framework and deployed using Heroku.

## Installation

Download the project from github and download nodejs and npm from https://nodejs.org. Make a mongoDB cluster on https://www.mongodb.com. Make a shell script following this format (but replace with your own mongoDB cluster)

export mongodb_URI='mongodb+srv://jameskong:passwordcs103a-cpa02.dq9w5.mongodb.net/databaseName?retryWrites=true&w=majority'
echo "connecting to $mongodb_URI"

nodemon

Finally cd into the folder containing the project.

Install the packages with
``` bash
npm install
```
Start the project with
``` bash
node app.js
```
or install nodemon (the node monitoring app) with
``` bash
npm install -g nodemon
```
and start the project locally with
``` bash
startup.sh
```
If you want to deploy online, you will need to make an account on Heroku and link your mongoDB and push the project. Heroku: https://dashboard.heroku.com/apps

Screenshots:
  
  ![image](https://user-images.githubusercontent.com/78178372/166342708-6b08e797-b398-4966-9d0b-54611104f1cf.png)

  ![image](https://user-images.githubusercontent.com/78178372/166342728-f5030e05-1f0e-4088-8c86-641d1920a75a.png)

  ![image](https://user-images.githubusercontent.com/78178372/166342814-94c26a63-1660-4077-99bd-d2063e8e66aa.png)
