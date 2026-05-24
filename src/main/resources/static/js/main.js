document.addEventListener("DOMContentLoaded", () => {

    cargarPeliculas();

    // BOTÓN CAMBIAR TEMA
    const themeBtn = document.getElementById("btnTema");

    if (themeBtn) {
        themeBtn.addEventListener("click", toggleTheme);
    }

});

/* ========================= */
/* CARGAR PELÍCULAS */
/* ========================= */

async function cargarPeliculas(facultad = "") {

    const grid = document.getElementById("movies");

    if (!grid) return;

    const url = facultad
        ? "/api/movies/faculty/" + facultad
        : "/api/movies";

    try {

        const response = await fetch(url);

        const peliculas = await response.json();

        grid.innerHTML = "";

        if (peliculas.length === 0) {

            grid.innerHTML = `
                <p>No hay películas para esta categoría.</p>
            `;

            return;
        }

        peliculas.forEach(peli => {

            const card = document.createElement("div");

            card.className = "movie";

            card.dataset.title = peli.title;
            card.dataset.genre = peli.genre;

            card.innerHTML = `

                <img src="${peli.imagePath}" alt="${peli.title}">

                <div class="overlay">

                    <b>${peli.title}</b>

                    <p>${peli.description}</p>

                    <button onclick="verDetalle(${peli.id})">
                        Ver ahora
                    </button>

                </div>

            `;

            grid.appendChild(card);

        });

    } catch (error) {

        console.error("Error al cargar películas:", error);

    }

}

/* ========================= */
/* FILTROS */
/* ========================= */

function filterFaculty(faculty) {

    if (faculty === "") {

        cargarPeliculas();

        return;
    }

    cargarPeliculas(faculty);

}

function filterByTag() {

    const tag =
        document.getElementById("tagFilter")
        .value
        .toLowerCase();

    const movies =
        document.querySelectorAll(".movie");

    movies.forEach(movie => {

        const genre =
            movie.dataset.genre.toLowerCase();

        movie.style.display =
            tag === "" || genre.includes(tag)
                ? "block"
                : "none";

    });

}

function searchMovie() {

    const input =
        document.getElementById("searchInput")
        .value
        .toLowerCase();

    const movies =
        document.querySelectorAll(".movie");

    movies.forEach(movie => {

        const title =
            movie.dataset.title.toLowerCase();

        movie.style.display =
            title.includes(input)
                ? "block"
                : "none";

    });

}

function showAll() {

    cargarPeliculas();

}

/* ========================= */
/* SIDEBAR */
/* ========================= */

function toggleSidebar() {

    const sidebar =
        document.getElementById("sidebar");

    if (!sidebar) return;

    sidebar.classList.toggle("active");

}

/* ========================= */
/* PERFIL */
/* ========================= */

function goProfile() {

    window.location.href = "perfil.html";

}

/* ========================= */
/* DETALLE */
/* ========================= */

function verDetalle(id) {

    window.location.href =
        `video.html?id=${id}`;

}

/* ========================= */
/* TEMA */
/* ========================= */

function toggleTheme() {

    document.body.classList.toggle("light-theme");

}

/* ========================= */
/* LOGOUT */
/* ========================= */

function logout() {

    localStorage.clear();

    window.location.href = "index.html";

}
