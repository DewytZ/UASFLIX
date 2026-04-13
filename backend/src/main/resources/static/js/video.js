let rating = 0;
let total = 0;
let count = 0;

document.addEventListener("DOMContentLoaded", async () => {
    // 1. Obtener ID de la película desde la URL (ej: video.html?id=1)
    const urlParams = new URLSearchParams(window.location.search);
    const movieId = urlParams.get('id');

    if (!movieId) {
        alert("No se seleccionó ninguna película.");
        window.location.href = "Pagina principal.html";
        return;
    }

    // 2. Cargar datos de la película desde el Backend
    try {
        const response = await fetch("/api/movies/" + movieId);
        if (!response.ok) throw new Error("Pelicula no encontrada");
        
        const peli = await response.json();

        // 3. Llenar el HTML con los datos reales
        document.getElementById("video-frame").src = peli.videoUrl || "https://www.youtube.com/embed/dQw4w9WgXcQ"; // Video por defecto si no hay
        document.getElementById("movie-title").innerText = peli.title;
        document.getElementById("movie-desc").innerText = peli.description;
        document.getElementById("movie-faculty").innerText = peli.faculty;
        
    } catch (error) {
        console.error("Error cargando película:", error);
    }

    inicializarEstrellas();
});

/* Lógica de Estrellas */
function inicializarEstrellas() {
    const stars = document.querySelectorAll(".star");
    stars.forEach((star, index) => {
        star.addEventListener("mouseover", () => {
            resetStars();
            for (let i = 0; i <= index; i++) stars[i].classList.add("hover");
        });
        star.addEventListener("click", () => {
            rating = index + 1;
            setSelected(rating);
        });
    });

    document.getElementById("stars").addEventListener("mouseleave", () => {
        resetStars();
        setSelected(rating);
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

/* Comentarios */
function addComment() {
    const text = document.getElementById("commentInput").value.trim();
    if (!text || rating === 0) {
        alert("Por favor selecciona una calificación y escribe un comentario.");
        return;
    }

    total += rating;
    count++;
    document.getElementById("avg").innerText = (total / count).toFixed(1);

    const div = document.createElement("div");
    div.classList.add("comment");
    div.innerHTML = `
        <div class="comment-stars">${"★".repeat(rating)}</div>
        <div>${text}</div>
    `;

    document.getElementById("commentList").prepend(div);
    document.getElementById("commentInput").value = "";
    rating = 0;
    resetStars();
}

function toggleTheme() {
    document.body.classList.toggle("light-theme");
}