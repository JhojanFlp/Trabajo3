const hbs = require('hbs');

// Cursos disponibles
hbs.registerHelper('listarCursosDisp', (list, session, id) => {
	let txt = 'No hay cursos disponibles';
	if(list.length > 0){
		txt = '<div class="accordion mb-3" id="accordionExample">';
		list.forEach((c, i) => {
			let aux
			if(c.int == null)
				aux = "Sin asignar"
			else
				aux = c.int
			txt += 
				`
				<div class="card">
					<div class="card-header" id="heading${i + 1}">
						<h2 class="mb-0 text-center">
							<button class="btn btn-link" type="button" data-toggle="collapse" data-target="#collapse${i + 1}" aria-expanded="true" aria-controls="collapse${i + 1}">
								${c.name} - ID: ${c.id} - Valor: ${c.valor} $
							</button>
						</h2>
					</div>

					<div id="collapse${i + 1}" class="collapse" aria-labellebdy="heading${i + 1}" data-parent="#accordionExample">
						<div class="card-body">
							<div class="row justify-content-center">
								Descripción: ${c.desc} <br>
								Modalidad: ${c.mod} <br>
								Intensida horaria: ${aux} horas
							</div>
							`
			if(session){
				txt +=
					`
					<div class="row justify-content-center my-2">
						<form action="/inscripcion" method="POST">
							<div class="form-group">
								<input type="hidden" name="idA" value=${id}>
								<button type="submit" class="btn btn-outline-success" name="idC" value=${c.id}>
						    		Inscibirme en este curso
						    	</button>
						    </div>
						</form>
					</div>
					`
			}
			else {
				txt +=
					`
					<div class="row justify-content-center my-2">
						<div class="alert alert-danger" role="alert">
							Inicie <a href='/'>sesión<a> para inscibirse, o <a href='/registro'>registrese <a>
							para crear una cuenta
						</div>
					</div>
					`
			}
			txt +=
				`
						</div>
					</div>
				</div>
				`
		});
		txt += '</div>';
	}
	return txt;
});

// Todos los cursos
hbs.registerHelper('listarCursos', (list) => {
	//let aux = list.filter(c => c.est == "disponible");
	let txt = 'No hay cursos disponibles';
	if(list.length > 0){
		txt =
			`
			<div class="row">
				<table class="table table-striped">
					<thead class="thead-dark">
						<tr>
							<th scope="col">Id</th>
						    <th scope="col">Nombre</th>
						    <th scope="col">Descripción</th>
						    <th scope="col">Valor</th>
						    <th scope="col">Modalidad</th>
						    <th scope="col">Intensidad (H)</th>
						    <th scope="col">Estado</th>
						</tr>
					</thead>
				<tbody>
			`;
		list.forEach((c, i) => {
			let auxInt
			if(c.int == null)
				auxInt = "-"
			else
				auxInt = c.int

			txt += 
				`
				<tr>
					<th scope="row">${c.id}</th>
					<td>${c.name}</td>
					<td>${c.desc}</td>
					<td>${c.valor}</td>
					<td>${c.mod}</td>
					<td>${auxInt}</td>
					<td>${c.est}</td>
				</tr>
				`
		});
		txt +=
			`
					</tbody>
				</table>
			</div>
			`;
	}
	return txt;
});

// hbs.registerHelper('deleteAsp', (idA, idC) => 
// 	funciones.deleteAsp(idA, idC));

// Aspiantes por cada curso
hbs.registerHelper('listarAspirantes', (listC, listA) => {
	let txt = 'No hay cursos disponibles';
	if(listC.length > 0){
		txt = "<div class='accordion' id='accordionExample'>";
		listC.forEach((c, i) => {
			txt += 
				`
				<div class="card">
					<div class="card-header" id="heading${i + 1}">
						<h2 class="mb-0">
							<button class="btn btn-link" type="button" data-toggle="collapse" data-target="#collapse${i + 1}" aria-expanded="true" aria-controls="collapse${i + 1}">
								${c.name} - ID: ${c.id}
							</button>
						</h2>
					</div>
				`
			asp = listA.filter(a => a.idC == c.id);
			if(asp.length > 0){
				txt += 
				`
				<div id="collapse${i + 1}" class="collapse" aria-labellebdy="heading${i + 1}" data-parent="#accordionExample">
					<div class="card-body">
						<table class="table table-striped">
							<thead class="thead-dark">
								<tr>
									<th scope="col">#</th>
								    <th scope="col">Nombre</th>
								    <th scope="col">Identificación</th>
								    <th scope="col"></th>
								</tr>
							</thead>
							<tbody>
				`
				asp.forEach((a, index) => {
					txt += 
					`
					<tr>
						<th scope="row">${index + 1}</th>
						<td>${a.name}</td>
						<td>${a.id}</td>
						<td>
							<form action="/delete" method="POST">
								<div class="form-group">
									<input type="hidden" name="idC" value=${c.id}>
									<button type="submit" class="btn btn-outline-danger" name="idA" value=${a.id}>
							    		Eliminar
							    	</button>
							    </div>
							</form>
						</td>
					</tr>
					`
				});
				txt += 
					`			</tbody>
							</table>
							<div class="row justify-content-center">
								<form action="/estado" method="POST" class="card my-2">
									<button type="submit" class="btn btn-danger btn-block" name="idC" value=${c.id}>
										Cerrar curso
									</button>
								</form>
							</div>
						</div>
					</div>
					`
			} else {
				txt += 
					`
					<div id="collapse${i + 1}" class="collapse" aria-labellebdy="heading${i + 1}" data-parent="#accordionExample">
						<div class="card-body">
							No hay aspirantes para este curso
						</div>
						<div class="row justify-content-center">
							<form action="/estado" method="POST" class="card my-2">
								<button type="submit" class="btn btn-danger btn-block" name="idC" value=${c.id}>
									Cerrar curso
								</button>
							</form>
						</div>
					</div>
					`
			}
		});
		txt += '</div>';
	}
	return txt;
});

hbs.registerHelper('listarAspCurso', (listA) => {
	txt = 
		`
		<table class="table table-striped">
			<thead class="thead-dark">
				<tr>
					<th scope="col">#</th>
				    <th scope="col">Nombre</th>
				    <th scope="col">Identificación</th>
				    <th scope="col">Email</th>
				    <th scope="col">Teléfono</th>
				</tr>
			</thead>
			<tbody>
		`
	if(listA.length != 0){
		listA.forEach((a, i) => {
			txt += 
			`
			<tr>
				<th scope="row">${i + 1}</th>
				<td>${a.name}</td>
				<td>${a.id}</td>
				<td>${a.email}</td>
				<td>${a.tel}</td>
			</tr>
			`
		});
	}
	else {
		txt += 
			`
			<tr>
				<th scope="row">Error:</td>
				<td></td>
				<td>504</td>
				<td>No hay aspirantes para este curso</td>
				</td>
			</tr>
			`
	}

	txt += 
	`			</tbdody>
			</table>
		</div>
	</div>
	`
	return txt;
});

// Cambiar estado
hbs.registerHelper('cambiarEstado', (idC) => 
	funciones.cambiarEstado(idC));