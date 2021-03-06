// Requires
const express = require('express');
const app = express();
const path = require('path');
const hbs = require('hbs');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
require('./config/config');

//Para usar sockets
const server = require('http').createServer(app);
const io = require('socket.io')(server);

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
		res.locals.id = req.session.usuario.id;
		res.locals.nombre = req.session.usuario.name;
		res.locals.email = req.session.usuario.email;
		res.locals.tel = req.session.usuario.tel;
		res.locals.foto = Buffer.from(req.session.usuario.foto).toString('base64');

		if(req.session.usuario.rol == "aspirante")
			res.locals.rolAsp = "aspirante";
		else if(req.session.usuario.rol == "coordinador")
			res.locals.rolC = "coordinador";
	}
	next();
});

// Routes
app.use(require('./routes/index'));

// Sockets - Chat
io.on('connection', (client) => {
	client.on('msj', (data, cb) => {
		io.emit('msj', data);
		cb();
	})

	client.on('typing', (data) => {
		client.broadcast.emit('typing', data);
	})
})

// Conexión de mongoose
mongoose.connect(process.env.URLDB, {useNewUrlParser: true} , (e, r) => {
	if(e)
		return console.log('Eror: ' + e);
	return console.log('Conectado');
});

// app -> Sin sockets
server.listen(process.env.PORT, () => {
	console.log('Escuchando en el puerto ' + process.env.PORT);
});