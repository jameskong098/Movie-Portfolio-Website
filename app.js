/*
  app.js -- This creates an Express webserver with login/register/logout authentication
*/

// *********************************************************** //
//  Loading packages to support the server
// *********************************************************** //
// First we load in all of the packages we need for the server...
const createError = require("http-errors"); // to handle the server errors
const express = require("express");
const path = require("path");  // to refer to local paths
const cookieParser = require("cookie-parser"); // to handle cookies
const session = require("express-session"); // to handle sessions using cookies
const debug = require("debug")("personalapp:server"); 
var MongoDBStore = require('connect-mongodb-session')(session);


// *********************************************************** //
//  Loading models
// *********************************************************** //


// *********************************************************** //
//  Connecting to the database 
// *********************************************************** //

const mongoose = require( 'mongoose' );

const mongodb_URI = process.env.mongodb_URI

const user_ID = process.env.userID

mongoose.connect( mongodb_URI, { useNewUrlParser: true, useUnifiedTopology: true } );
// fix deprecation warnings
mongoose.set('useFindAndModify', false); 
mongoose.set('useCreateIndex', true);

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {console.log("we are connected!!!")});





// *********************************************************** //
// Initializing the Express server 
// This code is run once when the app is started and it creates
// a server that respond to requests by sending responses
// *********************************************************** //
const app = express();

var store = new MongoDBStore({
  uri: mongodb_URI,
  collection: 'mySessions'
});

// Catch errors
store.on('error', function(error) {
  console.log(error);
});

app.use(require('express-session')({
  secret: 'This is a secret',
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 7 // 1 week
  },
  store: store,
  // Boilerplate options, see:
  // * https://www.npmjs.com/package/express-session#resave
  // * https://www.npmjs.com/package/express-session#saveuninitialized
  resave: true,
  saveUninitialized: true
}));

// Here we specify that we will be using EJS as our view engine
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");


// Here we process the requests so they are easy to handle
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Here we specify that static files will be in the public folder
app.use(express.static(path.join(__dirname, "public")));

// Here we enable session handling using cookies
app.use(
  session({
    secret: "zzzbbyanana789sdfa8f9ds8f90ds87f8d9s789fds", // this ought to be hidden in process.env.SECRET
    resave: false,
    saveUninitialized: false
  })
);

// *********************************************************** //
//  Defining the routes the Express server will respond to
// *********************************************************** //


// here is the code which handles all /login /signin /logout routes
const auth = require('./routes/auth');
const { deflateSync } = require("zlib");
app.use(auth)

// middleware to test is the user is logged in, and if not, send them to the login page
const isLoggedIn = (req,res,next) => {
  if (res.locals.loggedIn) {
    next()
  }
  else res.redirect('/login')
}

// URL Validation to check for embedded video link
const URL = require("url").URL;

const stringIsAValidUrl = (s) => {
  try {
    new URL(s);
    return true;
  } catch (err) {
    return false;
  }
};

// specify that the server should render the views/index.ejs page for the root path

app.get("/", (req, res) => {
  res.redirect('/index')
});

app.get("/index", (req, res) => {
  res.render("index");
});

app.get('/animations',
  async (req,res,next) => {
    try{
      let animations = await Animation.find({userId:user_ID}); // lookup the user's entries
      res.locals.animations = animations.reverse();  //make the items available in the view
      res.locals.animationsLength = animations.length;
      res.locals.invalidURL = false
      res.locals.edit = false;
      res.locals.animationID = ""
      res.render("animations");  // render to the reviewsPosts page
    } catch (e){
      next(e);
    }
  }
)

app.post('/animations/addAnimation',
  isLoggedIn,
  async (req,res,next) => {
    try{
      const {hrefLink,description} = req.body; // get hrefLink and description from the body
      if (!stringIsAValidUrl(hrefLink)) {
        res.locals.invalidURL = true;
        res.locals.edit = false;
        res.locals.animationID = ""
        let animations = await Animation.find({userId:user_ID}); // lookup the user's entries
        res.locals.animations = animations.reverse();  //make the items available in the view
        res.locals.animationsLength = animations.length;
        res.render("animations")
      }
      else {
        const userId = user_ID;

        let data = {userId, hrefLink, description} // create the data object
        let animation = new Animation(data) // create the database object (and test the types are correct)
        await animation.save() // save the entry in the database
        res.redirect('/animations')  // go back to the animations page
      }
    } catch (e){
      next(e);
    }
  }
)

app.get("/animations/delete/:animationId",
  isLoggedIn,
  async (req,res,next) => {
    try{
      const animationId=req.params.animationId; // get the id of the item to delete
      await Animation.deleteOne({_id:animationId}) // remove that item from the database
      res.redirect('/animations') // go back to the animations page
    } catch (e){
      next(e);
    }
  }
)

app.get("/animations/edit/:animationId",
  isLoggedIn,
  async (req,res,next) => {
    try{
      let animations = await Animation.find({userId:user_ID}); // lookup the user's entries
      res.locals.animations = animations.reverse();  //make the items available in the view
      res.locals.animationsLength = animations.length;
      res.locals.invalidURL = false
      res.locals.animationID = req.params.animationId;
      res.locals.edit = true;
      res.render("animations");
    } catch (e){
      next(e);
    }
  }
)

app.post("/animations/edit/save",
  isLoggedIn,
  async (req,res,next) => {
    try{
      const {animationId, description} = req.body;
      await Animation.findOneAndUpdate({_id:animationId}, {description: description}) // update that item in the database
      res.redirect('/animations') // go back to the animations page
    } catch (e){
      next(e);
    }
  }
)

app.get('/films',
  async (req,res,next) => {
    try{
      let films = await Film.find({userId:user_ID}); // lookup the user's entries
      res.locals.films = films.reverse();  //make the items available in the view
      res.locals.filmsLength = films.length;
      res.locals.invalidURL = false
      res.locals.edit = false;
      res.locals.filmID = ""
      res.render("films");  // render to the films page
    } catch (e){
      next(e);
    }
  }
)

app.post('/films/addFilm',
  isLoggedIn,
  async (req,res,next) => {
    try{
      const {hrefLink,description} = req.body; // get hrefLink and description from the body
      if (!stringIsAValidUrl(hrefLink)) {
        res.locals.invalidURL = true
        let films = await Film.find({userId:user_ID}); // lookup the user's entries
        res.locals.films = films.reverse();  //make the items available in the view
        res.locals.filmsLength = films.length;
        res.render("films")
      }
      else {
        const userId = user_ID;

        let data = {userId, hrefLink, description} // create the data object
        let film = new Film(data) // create the database object (and test the types are correct)
        await film.save() // save the entry in the database
        res.redirect('/films')  // go back to the animations page
      }
    } catch (e){
      next(e);
    }
  }
)

app.get("/films/delete/:filmId",
  isLoggedIn,
  async (req,res,next) => {
    try{
      const filmId=req.params.filmId; // get the id of the item to delete
      await Film.deleteOne({_id:filmId}) // remove that item from the database
      res.redirect('/films') // go back to the animations page
    } catch (e){
      next(e);
    }
  }
)

app.get("/films/edit/:filmId",
  isLoggedIn,
  async (req,res,next) => {
    try{
      let films = await Film.find({userId:user_ID}); // lookup the user's entries
      res.locals.films = films.reverse();  //make the items available in the view
      res.locals.filmsLength = films.length;
      res.locals.invalidURL = false
      res.locals.filmID = req.params.filmId;
      res.locals.edit = true;
      res.render("films");
    } catch (e){
      next(e);
    }
  }
)

app.post("/films/edit/save",
  isLoggedIn,
  async (req,res,next) => {
    try{
      const {filmId, description} = req.body;
      await Film.findOneAndUpdate({_id:filmId}, {description: description}) // update that item in the database
      res.redirect('/films') // go back to the animations page
    } catch (e){
      next(e);
    }
  }
)

app.get('/blogPosts',
  async (req,res,next) => {
    try{
      let blogPosts = await Post.find({userId:user_ID}); // lookup the user's entries
      res.locals.blogPosts = blogPosts.reverse();  //make the items available in the view
      res.locals.blogPostsLength = blogPosts.length;
      res.locals.blogPostID = "";
      res.locals.edit = false;
      res.render("blogPosts");  // render to the blogPosts page
    } catch (e){
      next(e);
    }
  }
)

app.post('/blogPosts/addBlogPost',
  isLoggedIn,
  async (req,res,next) => {
    try{
      const {title,description} = req.body; // get title, rating, and description from the body
      const userId = user_ID;
      const createdAt = new Date(); // get the current date/time
      
      let data = {userId, title, description, createdAt} // create the data object
      let post = new Post(data) // create the database object (and test the types are correct)
      await post.save() // save the entry in the database
      res.redirect('/blogPosts')  // go back to the blogPosts page
    } catch (e){
      next(e);
    }
  }
)

  app.get("/blogPosts/delete/:blogPostId",
  isLoggedIn,
  async (req,res,next) => {
    try{
      const blogPostId=req.params.blogPostId; // get the id of the item to delete
      await Post.deleteOne({_id:blogPostId}) // remove that item from the database
      res.redirect('/blogPosts') // go back to the blogPost page
    } catch (e){
      next(e);
    }
  }
)

app.get("/blogPosts/edit/:blogPostId",
  isLoggedIn,
  async (req,res,next) => {
    try{
      let blogPosts = await Post.find({userId:user_ID}); // lookup the user's entries
      res.locals.blogPosts = blogPosts.reverse();  //make the items available in the view
      res.locals.blogPostsLength = blogPosts.length;
      res.locals.blogPostId = req.params.blogPostId;
      res.locals.edit = true;
      res.render("blogPosts");
    } catch (e){
      next(e);
    }
  }
)

app.post("/blogPosts/edit/save",
  isLoggedIn,
  async (req,res,next) => {
    try{
      const {postId, title, description} = req.body;
      await Post.findOneAndUpdate({_id:postId}, {title: title, description: description}) // update that item in the database
      res.redirect('/blogPosts') // go back to the blogPosts
    } catch (e){
      next(e);
    }
  }
)

app.get("/about", (req, res) => {
  res.render("about");
});

app.get("/aboutDeveloper", (req, res) => {
  res.render("aboutDeveloper");
});

// here we catch 404 errors and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// this processes any errors generated by the previous routes
// notice that the function has four parameters which is how Express indicates it is an error handler
app.use(function(err, req, res) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  // render the error page
  res.status(err.status || 500);
  res.render("error");
});


// *********************************************************** //
//  Starting up the server!
// *********************************************************** //
//Here we set the port to use between 1024 and 65535  (2^16-1)
const port = process.env.PORT || '5000'
console.log('connecting on port '+port)

app.set("port", port);

// and now we startup the server listening on that port
const http = require("http");
const { reset } = require("nodemon");
const Animation = require("./models/Animation");
const Film = require("./models/Film");
const Post = require("./models/Post");
const e = require("connect-flash");
const server = http.createServer(app);

server.listen(port);

function onListening() {
  var addr = server.address();
  var bind = typeof addr === "string" ? "pipe " + addr : "port " + addr.port;
  debug("Listening on " + bind);
}

function onError(error) {
  if (error.syscall !== "listen") {
    throw error;
  }

  var bind = typeof port === "string" ? "Pipe " + port : "Port " + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(bind + " is already in use");
      process.exit(1);
      break;
    default:
      throw error;
  }
}

server.on("error", onError);

server.on("listening", onListening);

module.exports = app;
