const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Esquema de curso
const cursoSchema = new Schema({
	name: {
	  	type: String,
	  	required: true,
	    trim: true
	},
	id: {
		type: Number,
		required: true,
		unique: true
	},
	desc: {
		type: String,
		required: true
	},
	valor: {
		type: Number,
		required: true
	},
	mod: {
		type: String,
		default: "(Sin modalidad)"
	},
	int: {
		type: Number
	},
	est: {
		type: String,
		default: "disponible"
	}
});

//Modelo de estudiante
const Curso = mongoose.model('Curso', cursoSchema);

module.exports = Curso;