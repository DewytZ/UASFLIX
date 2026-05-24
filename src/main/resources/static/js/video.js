let userRating = 0; // Calificación que el usuario actual va a elegir
let globalMovieId = null;

document.addEventListener("DOMContentLoaded", async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const movieId = urlParams.get('id');
    globalMovieId = movieId;

    if (!movieId) {
        alert("No se seleccionó ninguna película.");
        window.location.href = "Pagina principal.html";
        return;
    }

    // Cargar datos de la película, promedio de estrellas y comentarios en paralelo
    try {
        const response = await fetch("/api/movies/" + movieId);
        if (!response.ok) throw new Error("Película no encontrada");
        
        const peli = await response.json();

        // Llenar datos de la película
        document.getElementById("video-frame").src = peli.videoUrl || "https://www.youtube.com/embed/dQw4w9WgXcQ";
        document.getElementById("movie-title").innerText = peli.title;
        document.getElementById("movie-desc").innerText = peli.description;
        document.getElementById("movie-faculty").innerText = peli.faculty;
        
        // Cargar datos interactivos de la Base de Datos
        loadAverageRating(movieId);
        loadComments(movieId);
        
    } catch (error) {
        console.error("Error cargando película:", error);
    }

    inicializarEstrellas();
});

/* ===============================
   LÓGICA DE ESTRELLAS (RATINGS)
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
            // Mandar la calificación a la base de datos inmediatamente al dar clic
            await saveRatingToDB(userRating);
        });
    });

    document.getElementById("stars").addEventListener("mouseleave", () => {
        resetStars();
        setSelected(userRating);
    });
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

// Guarda la calificación en el backend
async function saveRatingToDB(starsValue) {
    // Jalamos el correo del usuario que inició sesión (¡Asegúrate de guardarlo en el login!)
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
            // Si se guardó con éxito, recalculamos el promedio en pantalla
            loadAverageRating(globalMovieId);
        }
    } catch (error) {
        console.error("Error al guardar calificación:", error);
    }
}

// Trae el promedio de estrellas desde Java
async function loadAverageRating(movieId) {
    try {
        const response = await fetch(`/api/ratings/movie/${movieId}/average`);
        if (response.ok) {
            const avg = await response.json();
            // Muestra el promedio redondeado a 1 decimal (ej: 4.5)
            document.getElementById("avg").innerText = avg ? avg.toFixed(1) : "0";
        }
    } catch (error) {
        console.error("Error al cargar promedio:", error);
    }
}

/* ===============================
   LÓGICA DE COMENTARIOS
   =============================== */

// Publicar un nuevo comentario hacia el Backend
async function addComment() {
    const text = document.getElementById("commentInput").value.trim();
    // Jalamos el nombre del alumno guardado durante el login
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
            document.getElementById("commentInput").value = ""; // Limpiar caja
            loadComments(globalMovieId); // Recargar la lista para mostrar el nuevo
        } else {
            alert("No se pudo guardar el comentario.");
        }
    } catch (error) {
        console.error("Error al publicar comentario:", error);
    }
}

// Cargar y mostrar los comentarios guardados en la BD
async function loadComments(movieId) {
    try {
        const response = await fetch(`/api/comments/movie/${movieId}`);
        if (!response.ok) throw new Error("Error obteniendo comentarios");

        const listaComentarios = await response.json();
        const container = document.getElementById("commentList");
        container.innerHTML = ""; // Vaciar lista anterior

        if (listaComentarios.length === 0) {
            container.innerHTML = `<p class="no-comments">Sé el primero en dejar un comentario...</p>`;
            return;
        }

        listaComentarios.forEach(c => {
            const div = document.createElement("div");
            div.classList.add("comment-card"); // Usaremos esta nueva clase en CSS
            
            // Formatear un poco la fecha si viene del backend
            const fecha = c.createdAt ? new Date(c.createdAt).toLocaleDateString('es-MX', {
                day: '2-digit',
                month: 'short',
                year: 'numeric'
            }) : "Reciente";

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

function toggleTheme() {
    document.body.classList.toggle("light-theme");
}
