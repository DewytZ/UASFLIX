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
            UASFLIX es una plataforma digital impulsada por estudiantes de la Universidad Autónoma de Sinaloa. Se concibe 
            como un repositorio audiovisual que reúne películas de distintos géneros y épocas, con el propósito de ofrecer 
            a la comunidad universitaria un espacio confiable y accesible. Más que un catálogo, UASFLIX se plantea como un 
            puente entre la cultura cinematográfica y la vida académica, integrando el valor del séptimo arte en la formación 
            integral de los estudiantes.
        `
    },

    "objetivo": {
        title: "Objetivo",
        body: `
            Nuestra meta en UASFLIX es consolidarnos como una herramienta académica y recreativa que facilite el acceso a 
            material audiovisual de calidad. Buscamos fomentar el uso responsable de la tecnología, impulsar la apreciación 
            del cine como recurso cultural y fortalecer la identidad universitaria. Además, aspiramos a ser un referente 
            dentro de la UAS, ofreciendo un espacio que no solo entretenga, sino que también inspire pensamiento crítico, 
            creatividad y sentido de pertenencia institucional.
        `
    },

    "mision": {
        title: "Misión",
        body: `
            En UASFLIX, nos comprometemos a brindar a estudiantes, docentes y personal universitario un repositorio confiable, 
            organizado y de fácil navegación. A través de nuestro catálogo promovemos la cultura cinematográfica, el acceso 
            equitativo a recursos digitales y la integración de contenidos que enriquecen la experiencia universitaria. Nuestro 
            compromiso es ser un aliado en el proceso educativo, ofreciendo películas que complementen la enseñanza, fortalezcan 
            valores y estimulen la curiosidad intelectual.
        `
    },

    "vision": {
        title: "Visión",
        body: `
            En UASFLIX aspiramos a convertirnos en la plataforma audiovisual de referencia dentro de la Universidad Autónoma 
            de Sinaloa, reconocida por su calidad, accesibilidad y aporte cultural. Nos proyectamos hacia la innovación 
            tecnológica, la expansión de nuestro catálogo y la integración de contenidos educativos que impulsen el prestigio 
            de la institución. Queremos trascender como un modelo de repositorio universitario que inspire a otras comunidades 
            académicas, consolidándonos como un espacio donde cine y educación convergen para formar generaciones más críticas, 
            creativas y comprometidas con su entorno.
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
