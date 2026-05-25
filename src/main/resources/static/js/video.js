let userRating = 0;
let globalMovieId = null;

document.addEventListener("DOMContentLoaded", async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const movieId = urlParams.get("id");
    globalMovieId = movieId;

    if (!movieId) {
        alert("No se seleccionó ninguna película.");
        window.location.href = "Pagina principal.html";
        return;
    }

    // Sidebar y tema
    const sidebar = document.getElementById("sidebar");
    const btnTema = document.getElementById("btnTema");

    window.toggleSidebar = function () {
        if (!sidebar) return;
        sidebar.classList.toggle("active");
    };

    function applySavedTheme() {
        if (localStorage.getItem("theme") === "light") {
            document.body.classList.add("light-theme");
        } else {
            document.body.classList.remove("light-theme");
        }
    }

    window.toggleTheme = function () {
        document.body.classList.toggle("light-theme");

        localStorage.setItem(
            "theme",
            document.body.classList.contains("light-theme") ? "light" : "dark"
        );
    };

    if (btnTema) {
        btnTema.addEventListener("click", toggleTheme);
    }

    applySavedTheme();

    // Datos de la película
    try {
        const response = await fetch("/api/movies/" + movieId);
        if (!response.ok) throw new Error("Película no encontrada");

        const peli = await response.json();

        document.getElementById("video-frame").src =
            peli.videoUrl || "https://www.youtube.com/embed/dQw4w9WgXcQ";

        document.getElementById("movie-title").innerText = peli.title;
        document.getElementById("movie-desc").innerText = peli.description;
        document.getElementById("movie-faculty").innerText = peli.faculty;

        loadAverageRating(movieId);
        loadComments(movieId);

    } catch (error) {
        console.error("Error cargando película:", error);
    }

    inicializarEstrellas();

    // Footer interactivo
    inicializarFooter();
});

/* ===============================
   ESTRELLAS
   =============================== */
function inicializarEstrellas() {
    const stars = document.querySelectorAll(".star");

    stars.forEach((star, index) => {
        star.addEventListener("mouseover", () => {
            resetStars();
            for (let i = 0; i <= index; i++) stars[i].classList.add("hover");
        });

        star.addEventListener("click", async () => {
            userRating = index + 1;
            setSelected(userRating);
            await saveRatingToDB(userRating);
        });
    });

    const starsContainer = document.getElementById("stars");
    if (starsContainer) {
        starsContainer.addEventListener("mouseleave", () => {
            resetStars();
            setSelected(userRating);
        });
    }
}

function resetStars() {
    document.querySelectorAll(".star").forEach(s => {
        s.classList.remove("hover");
        s.classList.remove("selected");
    });
}

function setSelected(value) {
    const stars = document.querySelectorAll(".star");
    for (let i = 0; i < value; i++) stars[i].classList.add("selected");
}

async function saveRatingToDB(starsValue) {
    const userEmail = localStorage.getItem("userEmail") || "anonimo@uas.edu.mx";

    try {
        const response = await fetch("/api/ratings", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                movieId: globalMovieId,
                userEmail: userEmail,
                stars: starsValue
            })
        });

        if (response.ok) {
            loadAverageRating(globalMovieId);
        }
    } catch (error) {
        console.error("Error al guardar calificación:", error);
    }
}

async function loadAverageRating(movieId) {
    try {
        const response = await fetch(`/api/ratings/movie/${movieId}/average`);
        if (response.ok) {
            const avg = await response.json();
            document.getElementById("avg").innerText = avg ? avg.toFixed(1) : "0";
        }
    } catch (error) {
        console.error("Error al cargar promedio:", error);
    }
}

/* ===============================
   COMENTARIOS
   =============================== */
async function addComment() {
    const text = document.getElementById("commentInput").value.trim();
    const userName = localStorage.getItem("userName") || "Estudiante UAS";

    if (!text) {
        alert("Por favor escribe un comentario antes de publicar.");
        return;
    }

    try {
        const response = await fetch("/api/comments", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                movieId: globalMovieId,
                userName: userName,
                commentText: text
            })
        });

        if (response.ok) {
            document.getElementById("commentInput").value = "";
            loadComments(globalMovieId);
        } else {
            alert("No se pudo guardar el comentario.");
        }
    } catch (error) {
        console.error("Error al publicar comentario:", error);
    }
}

async function loadComments(movieId) {
    try {
        const response = await fetch(`/api/comments/movie/${movieId}`);
        if (!response.ok) throw new Error("Error obteniendo comentarios");

        const listaComentarios = await response.json();
        const container = document.getElementById("commentList");
        container.innerHTML = "";

        if (listaComentarios.length === 0) {
            container.innerHTML = `<p class="no-comments">Sé el primero en dejar un comentario...</p>`;
            return;
        }

        listaComentarios.forEach(c => {
            const div = document.createElement("div");
            div.classList.add("comment-card");

            const fecha = c.createdAt
                ? new Date(c.createdAt).toLocaleDateString("es-MX", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric"
                })
                : "Reciente";

            div.innerHTML = `
                <div class="comment-avatar">
                    ${c.userName.charAt(0).toUpperCase()}
                </div>
                <div class="comment-content">
                    <div class="comment-header">
                        <span class="comment-author">${c.userName}</span>
                        <span class="comment-date">${fecha}</span>
                    </div>
                    <div class="comment-text">${c.commentText}</div>
                </div>
            `;
            container.appendChild(div);
        });
    } catch (error) {
        console.error("Error al cargar comentarios:", error);
    }
}

/* ===============================
   CERRAR SESIÓN
   =============================== */
function logout() {
    localStorage.clear();
    window.location.href = "index.html";
}

/* ===============================
   FOOTER INTERACTIVO
   =============================== */
function inicializarFooter() {
    const footerData = {
        "que-es": {
            title: "¿Qué es UASFLIX?",
            body: `
                UASFLIX es una plataforma académica de la Universidad Autónoma de Sinaloa
                diseñada para mostrar contenido audiovisual de forma moderna, organizada
                y visualmente atractiva.
            `
        },
        objetivo: {
            title: "Objetivo",
            body: `
                Facilitar el acceso al contenido académico y multimedia mediante una
                interfaz sencilla, rápida y agradable para los estudiantes.
            `
        },
        mision: {
            title: "Misión",
            body: `
                Ofrecer una experiencia digital moderna que apoye la difusión de
                contenido universitario de manera eficiente.
            `
        },
        vision: {
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

    if (popup) {
        popup.style.display = "none";
    }

    document.querySelectorAll(".footer-link-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            const section = btn.dataset.section;

            if (currentSection === section && popup && popup.style.display === "block") {
                popup.style.display = "none";
                btn.classList.remove("active");
                currentSection = null;
                return;
            }

            document.querySelectorAll(".footer-link-btn").forEach(b => b.classList.remove("active"));
            btn.classList.add("active");

            if (popupTitle && popupBody && footerData[section]) {
                popupTitle.textContent = footerData[section].title;
                popupBody.innerHTML = footerData[section].body;
            }

            if (popup) {
                popup.style.display = "block";
            }

            currentSection = section;
        });
    });

    if (closeBtn && popup) {
        closeBtn.addEventListener("click", () => {
            popup.style.display = "none";
            document.querySelectorAll(".footer-link-btn").forEach(b => b.classList.remove("active"));
            currentSection = null;
        });
    }
}
