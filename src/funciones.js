const fs = require('fs');

listA = [];
listC = [];

const listarC = () => {
	try {
		listC = require('../ListC.json');
	} catch(err) {
		//Si no hay un archivo List.json
		listC = [];
	}
};

const guardarC = () => {
	let datos = JSON.stringify(listC);
	fs.writeFile('ListC.json', datos, (err) => {
		if(err) throw (err)
		console.log('Archivo creado satisfactoriamente - guardarC')
	});
};

const listarA = () => {
	try {
		listA = require('../ListA.json');
	} catch(err) {
		//Si no hay un archivo List.json
		listA = [];
	}
};

const guardarA = () => {
	let datos = JSON.stringify(listA);
	fs.writeFile('ListA.json', datos, (err) => {
		if(err) throw (err)
		console.log('Archivo creado satisfactoriamente - guardarA');
	});
};

const initJson = () => {
	listarA();
	listarC();
	guardarA();
	guardarC();
}

const crearC = (c) => {
	listarC();
	//No permitir los duplicados
	let duplicado = listC.find(cur => cur.id == c.id)
	if(!duplicado){
		listC.push(c);
		guardarC();
		return("Curso creado satisfactoriamente")
	} else 
		return('Ya existe un curso con ese ID');	
};

const listarCursos = () => {
	listarC();
	return(listC)
};

const inscribirAsp = (a) => {
	listarA();
	listarC();
	let cur = listC.find(c => c.id == a.c)
	if(cur){
		let dup = listA.find(asp => asp.id == a.id && asp.curso.id == a.c)
		if(!dup){
			let aux = {
				id: a.id,
				name: a.name,
				email: a.email,
				tel: a.tel,
				curso: cur
			}
			listA.push(aux);
			guardarA();
			return('Proceso de inscripción exitoso');
		} else {
			return('Erro: Ya se ha inscrito en ese curso');
		}
	} else
		return('Error: No existe un curso con ese id');
};

const deleteAsp = (idA, idC) => {
	listarA();
	let persons = listA.filter(asp => !((asp.id == idA) && (asp.curso.id == idC)));
	let p = listA.find(asp => ((asp.id == idA) && (asp.curso.id == idC)));
	//if(((persons.length != listA.length) && (listA.length != 0))){
	if(p){
		let i = listA.indexOf(p);
		listA.splice(i, 1);
		//listA = persons;
		guardarA();
		return("Persona eliminada con éxito");
	} else 
		return("La persona con ID: " + idA + 
			" no está matriculada en el curso con ID: " + idC);
};

const verificarEst = (curso) => {
	listarA();
	let aux1 = listA.filter(a => (a.curso.id == curso.id));
	let aux2 = listA.filter(a => (a.curso.id != curso.id));
	aux1.forEach((element) => element.curso = curso);
	aux1.forEach((element) => {
		aux2.push(element)
	});
	listA = aux2;
	guardarA();
};

const cambiarEstado = (idC) => {
	listarC();
	let curso = listC.find(c => c.id == idC);
	if(curso){
		curso.est = "cerrado";
		let aux = listC.filter(c => c.id != idC);
		aux.push(curso);
		listC = aux;
		guardarC();
		//Para modificar el estado de los cursos dentro de los aspirantes
		verificarEst(curso);
		return("El curso con ID " + idC +" está cerrado.");
	} else 
		return('El ID ingresado no pertene a un curso.');
};

module.exports = {
	crearC,
	listarCursos,
	inscribirAsp,
	deleteAsp,
	cambiarEstado,
	initJson
}