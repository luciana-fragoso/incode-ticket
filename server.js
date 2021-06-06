//Définition des modules
const express = require("express"); 
const mongoose = require("mongoose"); 
const bodyParser = require('body-parser');
const path = require('path');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

//Connexion à la base de donnée
mongoose.connect('mongodb://localhost/project10', {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useFindAndModify: false,
	useCreateIndex: true 
  }).then(() => {
	console.log('Connected to mongoDB')
}).catch(e => {
	console.log('Error while DB connecting');
console.log(e);
});


//On définit notre objet express nommé app
const app = express();

// view engine setup
app.set('views', path.join(__dirname, '/views/'));
app.set('view engine', 'ejs');

// public folder for static resources
app.use(express.static(path.join(__dirname, 'public')));

//Body Parser
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));

app.use(session({
	secret: 'MERRYCHRISTMAS',
	resave: false,
	saveUninitialized: false,
	store: new MongoStore({mongooseConnection: mongoose.connection })
}));



//Définition des CORS
app.use(function (req, res, next) {
	res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
	res.setHeader('Access-Control-Allow-Credentials', true);
	next();
});

var userRouter = require(__dirname + '/routes/userController');
app.use('/user', userRouter);
var ticketRouter = require(__dirname + '/routes/ticketController');
app.use('/ticket', ticketRouter);


var port = 3000;
app.listen(port, () => console.log(`Listening on port ${port}`));