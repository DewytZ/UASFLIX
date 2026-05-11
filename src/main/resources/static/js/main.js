document.addEventListener("DOMContentLoaded", () => {
    generarAbecedario();
    cargarPeliculas();

    // BOTÓN MENÚ
    const menuBtn = document.querySelector(".menu-btn");
    if (menuBtn) {
        menuBtn.addEventListener("click", toggleSidebar);
    }

    // BOTÓN BÚSQUEDA (abre/cierra el submenú)
    const searchBtn = document.querySelector("#btnBusqueda");
    if (searchBtn) {
        searchBtn.addEventListener("click", toggleSearch);
    }

    // BOTÓN TEMA (dentro del sidebar)
    const themeBtn = document.querySelector("#btnTema");
    if (themeBtn) {
        themeBtn.addEventListener("click", toggleTheme);
    }
});

// Generar botones A-Z dinámicamente
function generarAbecedario() {
    const alphabetDiv = document.querySelector(".alphabet");
    if (!alphabetDiv) return;

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

    const url = facultad ? "/api/movies/faculty/" + facultad : "/api/movies";

    try {
        const response = await fetch(url);
        const peliculas = await response.json();
        
        grid.innerHTML = "";

        if (peliculas.length === 0) {
            grid.innerHTML = "<p>No hay películas para esta categoría.</p>";
            return;
        }

        peliculas.forEach(peli => {
            const card = document.createElement("div");
            card.className = "movie";

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
    cargarPeliculas(faculty);
}

function showAll() {
    cargarPeliculas();
}

function searchMovie() {
    let input = document.getElementById("searchInput")?.value.toLowerCase() || "";
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
    window.location.href = `video.html?id=${id}`;
}

// 🔥 SIDEBAR
function toggleSidebar() {
    const sidebar = document.getElementById("sidebar");
    const btn = document.querySelector(".menu-btn");

    if (!sidebar) return;

    const abierto = sidebar.classList.toggle("active");

    if (btn) {
        btn.textContent = abierto ? "Cerrar" : "Menú";
    }
}

// SUBMENÚ
function toggleSearch() {
    const menu = document.getElementById("searchMenu");
    if (menu) {
        menu.classList.toggle("active");
    }
}

// PERFIL
function goProfile() {
    window.location.href = "perfil.html";
}

// FILTRAR POR ETIQUETAS
function filterByTag() {
    let tag = document.getElementById("tagFilter")?.value.toLowerCase() || "";
    let movies = document.querySelectorAll(".movie");

    movies.forEach(movie => {
        let genre = movie.dataset.genre.toLowerCase();
        movie.style.display = tag === "" || genre.includes(tag) ? "block" : "none";
    });
}

// CAMBIO DE TEMA
function toggleTheme() {
    const body = document.body;
    const btn = document.querySelector(".theme-btn");

    body.classList.toggle("light-theme");

    if (btn) {
        btn.textContent = body.classList.contains("light-theme")
            ? "🌙 Modo oscuro"
            : "☀️ Modo claro";
    }
}


