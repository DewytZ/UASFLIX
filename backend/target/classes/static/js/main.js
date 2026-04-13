document.addEventListener("DOMContentLoaded", () => {
    generarAbecedario();
    cargarPeliculas(); // Carga inicial
});

// Generar botones A-Z dinámicamente
function generarAbecedario() {
    const alphabetDiv = document.querySelector(".alphabet");
    for (let i = 65; i <= 90; i++) {
        const letter = String.fromCharCode(i);
        const btn = document.createElement("button");
        btn.innerText = letter;
        btn.onclick = () => filterLetter(letter);
        alphabetDiv.appendChild(btn);
    }
}

// CARGAR PELÍCULAS DESDE EL BACKEND
async function cargarPeliculas(facultad = "") {
    const grid = document.getElementById("movies");
    if (!grid) return;

    // Si pasamos facultad, usamos el endpoint de filtro, si no, traemos todas
    const url = facultad 
        ? `http://localhost:8080/api/movies/faculty/${facultad}`
        : "http://localhost:8080/api/movies";

    console.log("Pidiendo datos a: " + url);

    try {
        const response = await fetch(url);
        const peliculas = await response.json();
        
        grid.innerHTML = ""; // Limpiar antes de mostrar

        if (peliculas.length === 0) {
            grid.innerHTML = "<p>No hay películas para esta categoría.</p>";
            return;
        }

        peliculas.forEach(peli => {
            const card = document.createElement("div");
            card.className = "movie";
            // Guardamos datos en el dataset por si queremos filtrar en el cliente luego
            card.dataset.title = peli.title;
            card.dataset.faculty = peli.faculty;
            card.dataset.genre = peli.genre;

            card.innerHTML = `
                <img src="${peli.imagePath}" alt="${peli.title}">
                <div class="overlay">
                    <b>${peli.title}</b>
                    <p>${peli.description}</p>
                    <button onclick="verDetalle(${peli.id})">Ver ahora</button>
                </div>
            `;
            grid.appendChild(card);
        });

    } catch (error) {
        console.error("Error al cargar películas:", error);
    }
}

// FILTROS
function filterFaculty(faculty) {
    cargarPeliculas(faculty); // Llamamos directamente a la API para filtrar
}

function showAll() {
    cargarPeliculas(); // Carga sin parámetros
}

function searchMovie() {
    let input = document.getElementById("searchInput").value.toLowerCase();
    let movies = document.querySelectorAll(".movie");

    movies.forEach(movie => {
        let title = movie.dataset.title.toLowerCase();
        movie.style.display = title.includes(input) ? "block" : "none";
    });
}

function filterLetter(letter) {
    let movies = document.querySelectorAll(".movie");
    movies.forEach(movie => {
        let title = movie.dataset.title.toUpperCase();
        movie.style.display = title.startsWith(letter) ? "block" : "none";
    });
}

function verDetalle(id) {
    // Esto nos mandará a video.html?id=1
    window.location.href = `video.html?id=${id}`;
}