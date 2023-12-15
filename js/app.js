//Variables
const resultado = document.querySelector("#resultado");
const formulario = document.querySelector("#formulario"); //Añadimos el fomulario completo
const paginacionDiv = document.querySelector("#paginacion"); //Añadimos el elemento donde se inyectarán los botones de la paginación
const registrosPorPagina = 40;
let totalPaginas;
let iterador;
let paginaActual = 1;

//Event Listeners
window.onload = () =>{ //Es lo mismo que DOMCONTENTLOADED
    formulario.addEventListener("submit", validarFormulario); //Se validara apenas se de click en el botón de submit
}


//Funciones
//Validar formulario
function validarFormulario(e) {
    e.preventDefault();

    //Tomamos el valor de lo que el usuario escribio en el input
    const terminoBusqueda = document.querySelector("#termino").value;

    //Muestra un mensaje en caso de que el value sea un string vacío
    if(terminoBusqueda === ""){
        mostrarAlerta("Agrega un término de búsqueda");
        return;
    }

    //Si pasa la validación entonces llamamos a la Api
    buscarImagen(terminoBusqueda);
}


//Mostrar alerta
function mostrarAlerta(mensaje) {

    const existeAlerta = document.querySelector(".bg-red-100");

    if(!existeAlerta){ //Si la alerta es false, entonce se agrega la nueva alerta
        const alerta = document.createElement("P");
        alerta.classList.add("bg-red-100", "border-red-400", "text-red-700", "px-4", "py-3", "rounded", "max-w-lg", "mx-auto", "mt-6", "text-center");
        alerta.innerHTML = `
        <strong class="font-bold">Error</strong>
        <span class="block sm:inline">${mensaje}</span>
        `
    
        formulario.appendChild(alerta);
    
        setTimeout(() => {
            alerta.remove();
        }, 2000);
    }
    
}

async function buscarImagen() {

    const termino = document.querySelector("#termino").value;

    const key = "41073738-437a3c224026bf143dee308b7";
    const url = `https://pixabay.com/api/?key=${key}&q=${termino}&per_page=${registrosPorPagina}&page=${paginaActual}`;



    // fetch(url)
    //     .then((result) => {
    //         return result.json();
    //     }).then((result) => {
    //         totalPaginas = calcularPaginas(result.totalHits); //Total páginas será el resultado de lo que sea la fn calcularPaginas
    //         console.log(totalPaginas); 
    //         console.log(result);
    //         mostrarImagenes(result.hits);
    //     });

        try {
            const result = await fetch(url);
            const response = await result.json();
            totalPaginas = calcularPaginas(response.totalHits);
            mostrarImagenes(response.hits);
        } catch (error) {
            console.log(error);
        }
}


//Generador que va a registrar la cantidad de elementos de acuerdo a las páginas
function *crearPaginador(total) { 
    for (let index = 1; index <= total; index++) { 
        //Empieza en la página 1
        yield (index);
        
    }
}

function calcularPaginas(total) {
    return parseInt(Math.ceil(total / registrosPorPagina));
}

function mostrarImagenes(imagenes) {
    //Limpiará el div de resultado
    limpiarHTML(resultado);

    //Iterar sobre el array de imgs
    imagenes.forEach(imagen => { //Itera sobre el array de objetos y saca la información de cada uno
        const {previewURL, likes, views, largeImageURL} = imagen;

        //Construir el HTML

        //Con el += vamos concatenando cada imagen
        resultado.innerHTML += ` 

        <div class="w-1/2 md:w-1/3 lg:w-1/4 p-3 mb-4">
            <div class="bg-white">
                <img class="w-full" src="${previewURL}">
                <div class="p-4">
                    <p class="font-bold"> ${likes} <span class="font-light">Me gusta</span> </p>
                    <p class="font-bold"> ${views} <span class="font-light">Me gusta</span> </p>
                    <a href=${largeImageURL} 
                        rel="noopener noreferrer" 
                        target="_blank" class="bg-blue-800 w-full p-1 block mt-5 rounded text-center font-bold uppercase hover:bg-blue-500 text-white">Ver Imagen</a>
                </div>
            </div>
        </div>
        `;
    });

    limpiarHTML(paginacionDiv);
    imprimirPaginador();
    
}

function imprimirPaginador() {

    iterador = crearPaginador(totalPaginas);
    // console.log(iterador.next().value); //Nos muestra el valor de cada página según el iterador
    // console.log(iterador.next().done); //Revisa si el iterador ya terminó de trabajar

    while(true){
        const {value, done} = iterador.next();
            if(done) return; //Caso que el done sea true, ya no muestra nada y mandamos el resultado.

            // Caso contrario, genera un botón por cada elemento en el generador.
            const boton = document.createElement("A");
            boton.href = "#";
            boton.dataset.pagina = value; //Le agrega un atributo especial a nuestros elementos, en este caso será el nombre de página como atributo y el valor será el value de ese .next() generador
            boton.textContent = value;
            boton.classList.add("siguiente", "bg-yellow-400", "px-4", "py-1", "mr-2", "font-bold", "mb-5", "uppercase", "rounded");

            boton.onclick = () =>{
                //Hay que estar pendientes si la página tiene paginación
                paginaActual = value;
                //Para todos los botones ponemos que es igual a su valor
                //Volvemos a consultar nuestra API con un número diferente
                buscarImagen();
            }

            paginacionDiv.appendChild(boton);

    }
}

function limpiarHTML(contenedor) {
    while(contenedor.firstChild){
        contenedor.removeChild(contenedor.firstChild);
    }
}

