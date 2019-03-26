const express = require('express');
const app = express();
const path = require('path');
const hbs = require('hbs');
const bodyParser = require('body-parser');
require('./helpers') 

const directoryPublic = path.join(__dirname, '../public');
const directoryPartials = path.join(__dirname, '../partials')

app.use(express.static(directoryPublic));
app.use(bodyParser.urlencoded({extended: false}))
hbs.registerPartials(directoryPartials);

app.set('view engine', 'hbs');

app.get('/', (req, res) => {
	res.render('index');
});

app.get('/createCourse', (req, res) => {
	res.render('createCourse');
});

app.post('/createC', (req, res) => {
	res.render('createC', {
		name: req.body.name,
		id: parseInt(req.body.id),
		desc: req.body.descripcion,
		valor: parseFloat(req.body.valor),
		mod: req.body.modalidad,
		int: req.body.intensidad,
		est: "disponible"
	});
});

app.get('/cursos' , (req, res) => {
	res.render('cursos');
});

app.get('/inscripcion', (req, res) => {
	res.render('inscripcion');
});

app.post('/inscAspirante', (req, res) => {
	res.render('inscripcionAsp', {
		id: parseInt(req.body.id),
		name: req.body.name,
		email: req.body.email,
		tel: req.body.tel,
		c: parseInt(req.body.c)
	});
});

app.get('/showinscritos', (req, res) => {
	res.render('showinscritos');
});

app.post('/estado', (req, res) => {
	res.render('estado', {
		idC: parseInt(req.body.id)
	});
});

app.get('/delete', (req, res) => {
	res.render('delete')
});

app.post('/delAsp', (req, res) => {
	res.render('delAsp', {
		idA: req.body.idA,
		idC: req.body.idC
	});
});


app.get('*', (req, res) => {
	res.render('error');
});

app.listen(3000, () => {
	console.log('Escuchando en el puerto 3000');
});