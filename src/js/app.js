let paso = 1;
const pasoInicial = 1;
const pasoFinal = 3;

const cita = {
    id:'',
    nombre: '',
    fecha: '',
    hora: '',
    servicios: []
}

document.addEventListener('DOMContentLoaded', function() {
    iniciarApp();


})

function iniciarApp() {
    mostrarSeccion(); // muestra y oculta la secciones
    tabs(); // cambia la seccion cuando se presion los tabs
    botonesPaginador(); // agrega o quita los botones del paginador
    paginaAnterior();
    paginaSiguiente();

    consultarAPI(); // consultar la api en el backend de PHP

    idCliente();
    nombreCliente(); // añade al nombre al objecto de cita
    seleccionarFecha(); // añade la fecha de la cita en el objecto
    seleccionarHora();  // añade la hora al objecto
    mostrarResumen(); // muestra el resumen de la cita
}

function mostrarSeccion() {

    // ocultar la seccion que tenga la clases de mostrar
    const seccionAnterior = document.querySelector('.mostrar')
    if(seccionAnterior) {
        seccionAnterior.classList.remove('mostrar')
    }

    // seleccionar la seccion con el paso...
    const pasoSelector = `#paso-${paso}`;
    const seccion = document.querySelector(pasoSelector);
    seccion.classList.add('mostrar');

    // quita la clase actual al tab de la anterior
    const tabAnterior = document.querySelector('.actual')
    if(tabAnterior) {
        tabAnterior.classList.remove('actual');
    }


    // Resalta el tabs actual
    const tab = document.querySelector(`[data-paso="${paso}"]`)
    tab.classList.add('actual');

    


    
}

function tabs() {
    const botones = document.querySelectorAll('.tabs button');
    botones.forEach( boton => {
        boton.addEventListener('click', function(e) {
            paso = parseInt(e.target.dataset.paso);
            mostrarSeccion();
            botonesPaginador();

        })
    })

    
}

function botonesPaginador() {
    const paginaAnterior = document.querySelector('#anterior')
    const paginaSiguiente = document.querySelector('#siguiente')

    if(paso === 1) {
        paginaAnterior.classList.add('ocultar');
        paginaSiguiente.classList.remove('ocultar');
    } else if (paso === 3) {
       paginaAnterior.classList.remove('ocultar');
       paginaSiguiente.classList.add('ocultar');
       mostrarResumen();
    } else {
        paginaAnterior.classList.remove('ocultar');
        paginaSiguiente.classList.remove('ocultar');
    }
    mostrarSeccion();

    
} 

function paginaAnterior() {
    const paginaAnterior = document.querySelector('#anterior');
    paginaAnterior.addEventListener('click', function() {
        if(paso <= pasoInicial) return
        paso--;
        botonesPaginador();
    })
}

function paginaSiguiente() {
    const paginaSiguiente = document.querySelector('#siguiente');
    paginaSiguiente.addEventListener('click', function() {
        if(paso >= pasoFinal) return
        paso++;
        botonesPaginador();
    })
}

async function consultarAPI() {

    try {
        const url = '/api/servicios';
        const resultado = await fetch(url);
        const servicios = await resultado.json();
        mostrarServicios(servicios);

        
    } catch (error) {
        console.log(error);
    }

}

function mostrarServicios(servicios) {
    servicios.forEach( servicio => {
        const {id, nombre, precio} = servicio;

        const nombreServicio = document.createElement('P');
        nombreServicio.classList.add('nombre-servicio');
        nombreServicio.textContent = nombre;

        const precioServicio = document.createElement('P');
        precioServicio.classList.add('precio-servicio');
        precioServicio.textContent = `$${precio}`;

        const servicioDiv = document.createElement('DIV');
        servicioDiv.classList.add('servicio');
        servicioDiv.dataset.idServicio = id;
        servicioDiv.onclick = function() {
            seleccionarServicio(servicio);
        }

        servicioDiv.appendChild(nombreServicio);
        servicioDiv.appendChild(precioServicio);

        document.querySelector('#servicios').appendChild(servicioDiv);

        
    });
}

function seleccionarServicio(servicio) {
    const { id } = servicio;
    const { servicios } = cita;

    // indentificar al elemento que se la da click
    const divServicios = document.querySelector(`[data-id-servicio="${id}"]`)

    // comprobar si un servicio ya fue agregado
    if( servicios.some( agregado => agregado.id === id ) ) {  
        // eliminarlo
        cita.servicios = servicios.filter( agregado => agregado.id !== id )
        divServicios.classList.remove('seleccionado')
    } else {
        // agregarlo
        cita.servicios = [...servicios, servicio];
        divServicios.classList.add('seleccionado')
    }

    // console.log(cita);
}
function idCliente() {
    cita.id = document.querySelector('#id').value;
}

function nombreCliente() {
    cita.nombre = document.querySelector('#nombre').value;
}

function seleccionarFecha() {
    const inputFecha = document.querySelector('#fecha');
    inputFecha.addEventListener('input', function(e) {
        
        const dia = new Date(e.target.value).getUTCDay();

       if( [6,0].includes(dia) ) {
            e.target.value = '';    
            mostrarAlerta('Fines de semana no permitidos', 'error', '.formulario');
       }    else {
            cita.fecha = e.target.value;
       }
    });
}

function seleccionarHora() {
    const inputHora = document.querySelector('#hora');
    inputHora.addEventListener('input', function(e) {
        
        const horaCita = e.target.value;
        const hora = horaCita.split(":")[0];
        if( hora <10 || hora > 18 ) {
            e.target.value = '';
            mostrarAlerta('hora no valida', 'error', '.formulario')
        } else {
            cita.hora = e.target.value;
            // console.log(cita);
        }
    })

}

function mostrarAlerta(mensaje, tipo, elemento, desaparece = true) {

    // previene que se le agrege mas de una alerta
    const alertaPrevia = document.querySelector('.alerta');
    if(alertaPrevia) {
        alertaPrevia.remove();
    }
    // scripting para crear una alerta
    const alerta = document.createElement('DIV');
    alerta.textContent = mensaje;
    alerta.classList.add('alerta');
    alerta.classList.add(tipo);

    const referencia = document.querySelector(elemento)
    referencia.appendChild(alerta);

    if(desaparece) {
        // remover alerta en 3 segundo
        setTimeout(() => {
            alerta.remove();
        }, 3000);
    }
}

function mostrarResumen() {
    const resumen = document.querySelector('.contenido-resumen');

    // limpiar el contenido de resumen
    while(resumen.firstChild) {
        resumen.removeChild(resumen.firstChild);
    }

    if( Object.values(cita).includes('') || cita.servicios.length === 0 ) {
        mostrarAlerta('faltan datos de servicios, fecha u hora ', 'error', '.contenido-resumen', false);

        return;
    } 

    // formatear el Div de resumen
    const { nombre, fecha, hora, servicios } = cita;

    // heading para servicios y resumen
    const headingServicios = document.createElement('H3');
    headingServicios.textContent = 'Resumen de Servicios';
    resumen.appendChild(headingServicios);

    // iterando y mostrando lo servicios
    servicios.forEach(servicio => {
        const { id, precio, nombre } = servicio;
        const contenedorServicio = document.createElement('DIV');
        contenedorServicio.classList.add('contenedor-servicio');

        const textoServicio = document.createElement('P');
        textoServicio.textContent = nombre;

        const precioServicio = document.createElement('P');
        precioServicio.innerHTML = `<span>Precio:</span> $${precio}`;

        contenedorServicio.appendChild(textoServicio);
        contenedorServicio.appendChild(precioServicio);

        resumen.appendChild(contenedorServicio);
    })

    // heading para citas
    const headingCitas = document.createElement('H3');
    headingCitas.textContent = 'Resumen de citas';
    resumen.appendChild(headingCitas);
  
    const nombreCliente = document.createElement('P');
    nombreCliente.innerHTML = `<span>Nombre:</span> ${nombre}`;

    // formatear la fecha en español
    const fechaObj = new Date(fecha);
    const mes = fechaObj.getMonth();
    const dia = fechaObj.getDate() + 2;
    const year = fechaObj.getFullYear();

    const fechaUTC = new Date( Date.UTC(year, mes, dia));
    
    const opciones = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
    const fechaFormateada = fechaUTC.toLocaleDateString('es-Ve', opciones)

    
    const fechaCita = document.createElement('P');
    fechaCita.innerHTML = `<span>Fecha:</span> ${fechaFormateada}`;

    const horaCita = document.createElement('P');
    horaCita.innerHTML = `<span>Hora:</span> ${hora} Horas`;

    // boton para crear una cita
    const botonReservar = document.createElement('BUTTON');
    botonReservar.classList.add('boton');
    botonReservar.textContent = 'Reservar Cita';
    botonReservar.onclick = reservarCita;

    resumen.appendChild(nombreCliente);
    resumen.appendChild(fechaCita);
    resumen.appendChild(horaCita);
    resumen.appendChild(botonReservar);

    async function reservarCita() {

        const { nombre, fecha, hora, servicios, id } = cita; 

        const idServicios = servicios.map( servicio => servicio.id );
        // console.log(idServicios);

        const datos = new FormData();

        datos.append('fecha', fecha)
        datos.append('hora', hora)
        datos.append('usuarioId', id)
        datos.append('servicios', idServicios)

        // console.log([...datos]);

        try {

            // peticion hacia la api
            const url = '/api/citas' 

            const respuesta = await fetch(url, {
                method: 'POST',
                body: datos
            });

            const resultado = await respuesta.json();
            console.log(resultado.resultado); 

            if(resultado.resultado) {
                swal.fire({
                    icon: 'success',
                    title: 'Cita Creada',
                    text: 'Tu Cita Fue Creada Correctamente',
                    button: 'Ok'
                }).then( () => {
                    setTimeout(() => {
                        window.location.reload();
                    }, 500);
                })
            }

        } catch (error) {

            swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'hubo un error'
            })
            
        }
        
    
        

        // console.log([...datos]);
    }
    
}