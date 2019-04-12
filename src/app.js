// Requires
const express = require('express');
const app = express();
const path = require('path');
const hbs = require('hbs');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
require('./config/config');

// Paths
const directoryPublic = path.join(__dirname, '../public');
const dirNode_modules = path.join(__dirname , '../node_modules');

// Para variable de session
const session = require('express-session');
var MemoryStore = require('memorystore')(session);

// Static
app.use(express.static(directoryPublic))
app.use('/css', express.static(dirNode_modules + '/bootstrap/dist/css'));
app.use('/js', express.static(dirNode_modules + '/jquery/dist'));
app.use('/js', express.static(dirNode_modules + '/popper.js/dist'));
app.use('/js', express.static(dirNode_modules + '/bootstrap/dist/js'));

// BodyParser
app.use(bodyParser.urlencoded({extended: false}))

// Session wiht Memorystore
app.use(session({
	cookie: { maxAge: 86400000 },
 	store: new MemoryStore({
      	checkPeriod: 86400000 // prune expired entries every 24h
    	}),
  	secret: 'keyboard cat',
  	resave: true,
  	saveUninitialized: true
}));

//Midlewares para la sesión
app.use((req, res, next) => {
	if(req.session.usuario){
		res.locals.session = true;
		res.locals.nombre = req.session.usuario.name;
		res.locals.id = req.session.usuario.id
		if(req.session.usuario.rol == "aspirante")
			res.locals.rolAsp = "aspirante";
		else if(req.session.usuario.rol == "coordinador")
			res.locals.rolC = "coordinador";
	}
	next();
});

// Routes
app.use(require('./routes/index'));

// Conexión de mongoose
mongoose.connect(process.env.URLDB, {useNewUrlParser: true} , (e, r) => {
	if(e)
		return console.log('Eror: ' + e);
	return console.log('Conectado');
});

app.listen(process.env.PORT, () => {
	console.log('Escuchando en el puerto ' + process.env.PORT);
});