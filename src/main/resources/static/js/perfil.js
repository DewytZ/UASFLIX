// ===============================
// SIDEBAR
// ===============================

const sidebar = document.getElementById("sidebar");
const btnTema = document.getElementById("btnTema");

function toggleSidebar() {
    if (!sidebar) return;
    sidebar.classList.toggle("active");
}

// ===============================
// TEMA
// ===============================

function applySavedTheme() {
    if (localStorage.getItem("theme") === "light") {
        document.body.classList.add("light-theme");
    } else {
        document.body.classList.remove("light-theme");
    }
}

function toggleTheme() {
    document.body.classList.toggle("light-theme");

    localStorage.setItem(
        "theme",
        document.body.classList.contains("light-theme") ? "light" : "dark"
    );
}

if (btnTema) {
    btnTema.addEventListener("click", toggleTheme);
}

applySavedTheme();

// ===============================
// DATOS DEL USUARIO
// ===============================

const usuario = JSON.parse(localStorage.getItem("usuarioLogueado"));

if (usuario) {
    document.getElementById("username").textContent = usuario.nombre || "";
    document.getElementById("email").textContent = usuario.correo || "";
} else {
    window.location.href = "index.html";
}

// ===============================
// IR A INICIO
// ===============================

function goHome() {
    window.location.href = "Pagina principal.html";
}

// ===============================
// CERRAR SESIÓN
// ===============================

function logout() {
    localStorage.removeItem("usuarioLogueado");
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
