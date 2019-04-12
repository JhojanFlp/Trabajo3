const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Esquema de curso
const usuarioSchema = new Schema({
	id: {
		type: Number,
		required: true,
		unique: true
	},
	name: {
	  	type: String,
	  	required: true,
	    trim: true,
	},
	email: {
		type: String,
        trim: true,
        lowercase: true,
        unique: true,
        required: true
	},
	tel: {
		type: Number,
		required: true
	},
	rol: {
		type: String,
		default: "aspirante"
	},
	password: {
		type: String,
		required: true
	}
});

//Modelo de estudiante
const Usuario = mongoose.model('Usuario', usuarioSchema);

module.exports = Usuario;