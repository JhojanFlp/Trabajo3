const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// var ObjectId = mongoose.Schema.Types.ObjectId;

// Esquema de curso
const aspiranteSchema = new Schema({
	id: {
		type: Number,
		required: true
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
        required: true
	},
	tel: {
		type: Number,
		required: true
	},
	idC: {
		type: Number,
		required: true
	}
});

/*const aspiranteSchema = new Schema({
	id: {
		type: Number,
		required: true
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
	idC: {
		type: Number,
		required: true
	}
});
*/
//Modelo de estudiante
const Aspirante = mongoose.model('Aspirante', aspiranteSchema);

module.exports = Aspirante;