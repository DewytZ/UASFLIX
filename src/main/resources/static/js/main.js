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


// ===============================
// FOOTER → MINI VENTANA INTERACTIVA
// ===============================

const footerData = {
    "que-es": {
        title: "¿Qué es UASFLIX?",
        body: `
            UASFLIX es una plataforma académica de la Universidad Autónoma de Sinaloa
            diseñada para mostrar contenido audiovisual de forma moderna, organizada
            y visualmente atractiva.
        `
    },

    "objetivo": {
        title: "Objetivo",
        body: `
            Facilitar el acceso al contenido académico y multimedia mediante una
            interfaz sencilla, rápida y agradable para los estudiantes.
        `
    },

    "mision": {
        title: "Misión",
        body: `
            Ofrecer una experiencia digital moderna que apoye la difusión de
            contenido universitario de manera eficiente.
        `
    },

    "vision": {
        title: "Visión",
        body: `
            Convertirse en una plataforma universitaria innovadora, funcional
            y representativa para la comunidad estudiantil.
        `
    }
};

const popup = document.getElementById("footerPopup");
const popupTitle = document.getElementById("footerPopupTitle");
const popupBody = document.getElementById("footerPopupBody");
const closeBtn = document.getElementById("footerPopupClose");

let currentSection = null;

/* OCULTAR COMPLETAMENTE AL INICIO */

popup.style.display = "none";

/* BOTONES */

document.querySelectorAll(".footer-link-btn").forEach(btn => {

    btn.addEventListener("click", () => {

        const section = btn.dataset.section;

        /* SI YA ESTÁ ABIERTO → CERRAR */

        if (currentSection === section) {

            popup.style.display = "none";

            btn.classList.remove("active");

            currentSection = null;

            return;
        }

        /* LIMPIAR ACTIVOS */

        document.querySelectorAll(".footer-link-btn")
            .forEach(b => b.classList.remove("active"));

        btn.classList.add("active");

        /* MOSTRAR */

        popupTitle.textContent =
            footerData[section].title;

        popupBody.innerHTML =
            footerData[section].body;

        popup.style.display = "block";

        currentSection = section;
    });
});

/* BOTÓN X */

if (closeBtn) {

    closeBtn.addEventListener("click", () => {

        popup.style.display = "none";

        document.querySelectorAll(".footer-link-btn")
            .forEach(b => b.classList.remove("active"));

        currentSection = null;
    });
}
