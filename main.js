const urlAPI_Random = "https://api.thecatapi.com/v1/images/search?limit=4";
const urlAPI_Favorites = "https://api.thecatapi.com/v1/favourites?";
const urlAPI_Upload = "https://api.thecatapi.com/v1/images/upload";
const urlAPI_Favorites_Delete = (id) => 'https://api.thecatapi.com/v1/favourites/' + id + '?';
const apiKey = 'api_key=live_fwP4ePsTSbAhBYVFvwCOVg7NjZ1vyJEI1CpFbt5Fm15rxzfmJIiDVLisXMcWg7rC'

// fetch(urlAPI_Random)
//     .then(res => res.json())
//     .then(data => {
//         const img = document.querySelector('img');
//         img.src = data[0].url;
//     });

const img1 = document.querySelector('#img1');
const img2 = document.querySelector('#img2');
const img3 = document.querySelector('#img3');
const img4 = document.querySelector('#img4');
const btn = document.querySelector('#btnGenerar');
const btnGuardar1 = document.querySelector('#btnGuardar1');
const btnGuardar2 = document.querySelector('#btnGuardar2');
const btnGuardar3 = document.querySelector('#btnGuardar3');
const btnGuardar4 = document.querySelector('#btnGuardar4');
const spanError = document.getElementById('errorPelosos');
const inputFile = document.getElementById('file');

function notificacionGuardado() {
    // Muestra la notificación
    const notificacion = document.getElementById("notificacion");
    notificacion.style.display = "block";

    // Establece el mensaje de la notificación
    //notificacion.textContent = "Pelosito guardado en favoritos";

    // Oculta la notificación después de 3 segundos (3000 milisegundos)
    setTimeout(function() {
        notificacion.style.display = "none";
    }, 3000);
}

function notificacionEliminado() {
    // Muestra la notificación
    const notificacion = document.getElementById("notificacionEliminado");
    notificacion.style.display = "block";

    // Establece el mensaje de la notificación
    notificacion.textContent = "Pelosito eliminado en favoritos";

    // Oculta la notificación después de 3 segundos (3000 milisegundos)
    setTimeout(function() {
        notificacion.style.display = "none";
    }, 3000);
}

async function loadRandomMichis(){
    const response = await fetch(`${urlAPI_Random}`); //ir por los datos 
    const data = await response.json(); //espera la transformacion
    console.log('Random');
    console.log(data);

    if(response.status !== 200){
        spanError.innerHTML = 'Hubo un error: ' + response.status;
    }else{
        img1.src = data[0].url;
        img2.src = data[1].url;
        img3.src = data[2].url;
        img4.src = data[3].url;

        btnGuardar1.onclick = () => saveFavourite(data[0].id);
        btnGuardar2.onclick = () => saveFavourite(data[1].id);
        btnGuardar3.onclick = () => saveFavourite(data[2].id);
        btnGuardar4.onclick = () => saveFavourite(data[3].id);
    }
}

async function loadFavoritesMichis(){
    const response = await fetch(`${urlAPI_Favorites}`, {
        method: 'GET',
        headers:{
            'x-api-key': 'live_fwP4ePsTSbAhBYVFvwCOVg7NjZ1vyJEI1CpFbt5Fm15rxzfmJIiDVLisXMcWg7rC',
        },
    }); //ir por los datos 
    const data = await response.json(); //espera la transformacion
    console.log('Favoritos');
    console.log(data);

    if(response.status !== 200){
        spanError.innerHTML = 'Hubo un error: ' + response.status;
        console.log('error');
    }else{
        const section = document.getElementById('pelososFavoritos')
        section.innerHTML = "";

        const h2 = document.createElement('h2');
        const h2Text = document.createTextNode('Pelositos favoritos');
        h2.appendChild(h2Text);
        section.appendChild(h2);
        
        const divContainer = document.createElement('div');
        divContainer.classList.add('container2');

        /*
        <article>
            <img id="img2" alt="Foto de pelosito aleatorio" />
            <button id="btnEliminar">
                <img id="iconMeGusta" src="./icons/me-gusta.png" alt="Guardar en favoritos">
            </button>
        </article>
        */
        data.forEach(michi => {
            const article = document.createElement('article');
            const img = document.createElement('img');
            const btn = document.createElement('button');
            btn.setAttribute('id', 'btnEliminar');
            const imgButton = document.createElement('img');
            imgButton.setAttribute('src', './icons/eliminar.png');
            imgButton.setAttribute('id', 'iconEliminar');

            img.src = michi.image.url;
            img.width = 150;
            btn.appendChild(imgButton);
            btn.onclick = () => deleteFavoriteMichis(michi.id);
            article.appendChild(img);
            article.appendChild(btn);
            divContainer.appendChild(article);
        });
        section.appendChild(divContainer);
    }
}

async function saveFavourite(id){
    const response = await fetch(`${urlAPI_Favorites}`,{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-api-key': 'live_fwP4ePsTSbAhBYVFvwCOVg7NjZ1vyJEI1CpFbt5Fm15rxzfmJIiDVLisXMcWg7rC',
        },
        body: JSON.stringify({
            image_id: id
        }),
    }); 

    const data = await response.json(); //espera la transformacion
    console.log('Save');
    console.log(response);

    if(response.status !== 200){
        spanError.innerHTML = 'Hubo un error: ' + response.status;
        console.log('error');
    }else {
        console.log('Peloso guardado en favoritos');
        notificacionGuardado();
        loadFavoritesMichis();
    }
}

async function deleteFavoriteMichis(id){
    const response = await fetch(`${urlAPI_Favorites_Delete(id)}`,{
        method: 'DELETE',
        headers: {
            'x-api-key': 'live_fwP4ePsTSbAhBYVFvwCOVg7NjZ1vyJEI1CpFbt5Fm15rxzfmJIiDVLisXMcWg7rC',
        }
    });

    const data = await response.json();

    if (response.status !== 200) {
        spanError.innerHTML = "Hubo un error: " + response.status + data.message;
    } else {
        console.log('Michi eliminado de favoritos');
        notificacionEliminado();
        loadFavoritesMichis();
    }
}

async function uploadMichiPhoto(){
    const form = document.getElementById('uploadingForm');
    const formData = new FormData(form);

    //console.log(formData.get('file'));
    const response = await fetch(`${urlAPI_Upload}`, {
        method: 'POST',
        headers: {
            'x-api-key': 'live_fwP4ePsTSbAhBYVFvwCOVg7NjZ1vyJEI1CpFbt5Fm15rxzfmJIiDVLisXMcWg7rC',
        },
        body: formData,
    });
    
    const data = await response.json();

    if (response.status !== 200 && response.status !== 201) {
        spanError.innerHTML = "Hubo un error: " + response.status + data.message;
    } else {
        console.log('Foto de michi subida');
        console.log({data});
        console.log(data.url);
        saveFavourite(data.id);
        notificacionGuardado();
        inputFile.value="";
        loadFavoritesMichis();
    }
}

loadRandomMichis();
loadFavoritesMichis();