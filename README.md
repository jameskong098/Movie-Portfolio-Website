This website was made for my fellow good friend Max Goodman. I offered to make this website for him to get more practice working with express.js and also to get another project down my belt. It is also just fun overall to make things for people.

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
