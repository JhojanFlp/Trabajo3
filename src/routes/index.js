// Require
const express = require('express');
const app = express ();
const path = require('path');
const hbs = require('hbs');
const bcrypt = require('bcrypt');
const multer  = require('multer');

//Para usar sockets
const server = require('http').createServer(app);
const io = require('socket.io')(server);

//Email
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Models
const Curso = require('./../models/curso');
const Aspirante = require('./../models/aspirante');
const Usuario = require('./../models/usuario');

// Paths
const directoryPartials = path.join(__dirname, '../../template/partials');
const directoryViews = path.join(__dirname, '../../template/views');

// Helpers
require('./../helpers/helpers')

// Sockets

// Hbs
app.set('view engine', 'hbs');
app.set('views', directoryViews);
hbs.registerPartials(directoryPartials);

app.get('/', (req, res) => {
	res.render('index');
});

app.get('/registro' , (req, res) => {
	res.render('registro');
});

var upload = multer({ 
	limits: {
		fileSize: 1000000
	},
	fileFilter (req, file, cb) {
		if(!file.originalname.match(/\.(png|jpg|jpeg)$/)){
			req.fileValidation = "Error"
			return cb(null, false, new Error('Extensión inválida'))
		}
		cb(null, true)
	}
})

app.post('/validation', upload.single('foto') ,(req, res) => {
	if(req.fileValidation)
		return res.render('validation', {
				e: "Deber ser una imagen con una extensión: Jpg, Jpeg o Png"
			}); 

	let usuario = new Usuario ({
		id: parseInt(req.body.id),
		name: req.body.name,
		email: req.body.email,
		tel: req.body.tel,
		rol: "aspirante",
		password: bcrypt.hashSync(req.body.password, 10),
		foto: req.file.buffer
	});

	Usuario.find({id: usuario.id}).exec((e, asp) => {
		if(e)
			return res.render('validation', {
				e: e
			}); 
		if(asp.length != 0)
			return res.render('validation', {
				e: "Error: Ya existe un usuario con esa identificación"
			});

		// Usuario nuevo

		// Email
		let email = {
			to: usuario.email,
			from : 'cursosext.app@gmail.com',
			subject: 'Bienvenido a CursosApp',
			text: `Bienvenido a la página de CursosApp, aquí encontrarás todos los cursos
					que necesitas para complementar tu vida académica y profesional`,
			html: `
					<br>
					<div>
						<img src="img/student.jpg" style="width: 100%" align="middle">
					</div>
					<br>
					<br>
					<h3>- Administración de cursosApp</h3>
				  `
		}

		usuario.save((e, r) => {
			if(e)
				return res.render('validation', {
					e: e
				});
		    sgMail.send(email);
			res.render('validation', {
				r1: "Se ha registrado su usuario",
				r2: "Ingrese a su cuenta por favor"
			});
		});
	});
});

app.post('/ingresar', (req, res) => {
	Usuario.findOne({id: req.body.id}, (e, r) => {
		if(e)
			return res.render('ingresar', {e: "Error de ingreso"});
		if((!r) || (!bcrypt.compareSync(req.body.password, r.password)))
			return res.render('ingresar', {e: "Datos incorrectos"});
		// En la variable de session almacenamos todo el usuario
		req.session.usuario = r;
		foto = r.foto.toString('base64');
		if(r.rol == "aspirante"){
			res.render('ingresar', {
				msj: "Bienvenido " + r.name + " al portal de notas.",
				rolAsp: r.rol,
				session: true,
				foto: foto
			});
		}
		else if(r.rol == "coordinador"){
			res.render('ingresar', {
				msj: "Bienvenido " + r.name + " al portal de notas.",
				rolC: r.rol,
				session: true
			});
		}
	});
});

app.get('/salir', (req, res) => {
	// Destoy session
	req.session.destroy((e) => {
		if(e) 
			return console.log(e)
	});
	res.redirect('/');
});

app.get('/chat', (req, res) => {
	res.render('chat');
});

app.get('/createCourse', (req, res) => {
	res.render('createCourse');
});

app.post('/createC', (req, res) => {
	let curso = new Curso ({
		name: req.body.name,
		id: parseInt(req.body.id),
		desc: req.body.descripcion,
		valor: parseFloat(req.body.valor),
		mod: req.body.modalidad,
		int: req.body.intensidad,
		est: "Disponible"
	});

	Curso.find({id: curso.id}).exec((e, c) => {
		if(e){
			return res.render('createC', {
				e: e
			});
		}
		if(c.length != 0){
			return res.render('createC', {
				e: "Error: Ya existe un curso con esa identificación"
			});
		}
		// Es un curso nuevo
		curso.save((e, r) => {
			if(e)
				return res.render('createC', {
					e: e
				});
			res.render('createC', {
				msj: "El curso: " + r.name + " fue creado satisfactoriamete"
			});
		});
	});
});

app.get('/cursos' , (req, res) => {
	Curso.find({est: "Disponible"}).exec((e, cursos) => {
		if(e){
			return res.render('cursos', {
				listC: [],
				msj: "Error en la búsqueda"
			});
		}
		res.render('cursos', {
			listC: cursos
		});
	});
});

app.get('/cursosAll' , (req, res) => {
	Curso.find({}).exec((e, cursos) => {
		if(e){
			return res.render('cursosAll', {
				listC: [],
				msj: "Error en la búsqueda"
			});
		}
		res.render('cursosAll', {
			listC: cursos
		});
	});
});

app.post('/inscripcion', (req, res) => {
	Usuario.find({id: req.body.idA}).exec((e, u) => {
		Curso.find({id: req.body.idC}).exec((e, c) => {
			let aspirante = new Aspirante ({
				id: u[0].id,
				name: u[0].name,
				email: u[0].email,
				tel: u[0].tel,
				idC: c[0].id
			});

			//Verificación
			Aspirante.find({id: aspirante.id, idC: aspirante.idC}).exec((e, asp) => {
				if(e)
					return res.render('inscripcion', {
						e: e
					}); 
				if(asp.length != 0)
					return res.render('inscripcion', {
						e: "Error: Ya se ha inscrito en ese curso"
					});
				// Si no está aspirando a ese curso
				aspirante.save((e, r) => {
					if(e)
						return res.render('inscripcion', {
							e: e
						});
					res.render('inscripcion', {
						msj: "Proceso de inscripción exitoso"
					});
				});
			});
		});
	});
});

app.get('/showInscritos', (req, res) => {
	Curso.find({est: "Disponible"}).exec((e, cursos) => {
		if(e){
			return res.render('showInscritos', {
				listC: [],
				listA: [],
				msj: "Error en la búsqueda de cursos"
			});
		}
		else {
			Aspirante.find({}).exec((e, asp) => {
				if(e){
					return res.render('showInscritos', {
						listC: cursos,
						listA: [],
						msj: "Error en la búsqueda de aspirantes"
					});
				}
				else {
					res.render('showInscritos', {
						listC: cursos,
						listA: asp
					});
				}
			});
		}
	});
});

app.post('/estado', (req, res) => {
	Curso.findOneAndUpdate({id: req.body.idC}, {est: "Cerrado"}, (e, r) => {
		if(e)
			return res.render('estado', {
				msj: e
			});
		res.render('estado', {
			msj: "El curso ha sido cerrado"
		});
	});
});


app.post('/delete', (req, res) => {
	Aspirante.findOneAndDelete({id: req.body.idA, idC: req.body.idC}, (e, r) => {
		if(e)
			return res.render('delete', {
				msj: e
			});
		Aspirante.find({idC: req.body.idC}).exec((er, list) => {
			if(er){
				return res.render('delete', {
					listA: [],
					msj: "Error: No se puede mostrar la tabla"
				});
			}
			res.render('delete', {
				msj: "La persona con id: " + r.id + " ha sido eliminado del curso con id: " + r.idC,
				listA: list
			});
		});
	});
});

app.get('*', (req, res) => {
	res.render('error' ,{
		msj: "Error 504: Página no encontrada"
	});
});

module.exports = app