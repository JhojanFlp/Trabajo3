const socket = io()

// DOM ELEMENTS
let name = document.getElementById('name');
let msj = document.getElementById('msj');
let btn = document.getElementById('enviar');
let output = document.getElementById('output');
let actions = document.getElementById('actions');

btn.addEventListener('click', () => {
	socket.emit('msj', {
		name: name.value,
		msj: msj.value
		}, () => {
		msj.value = ''
		msj.focus()
	})
})

msj.addEventListener('keyup', () => {
	socket.emit('typing', name.value)
})

socket.on('msj', (data) => {
	actions.innerHTML = ''
	output.innerHTML += `<p>
		<strong>${data.name}</strong>: ${data.msj}
	</p>`
})

socket.on('typing', (data) => {
	actions.innerHTML = `<p><em>${data} está escribiendo un mensaje</em></p>`
})