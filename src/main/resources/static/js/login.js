function showLogin() {

    const loginBox = document.getElementById("loginBox");
    const registerBox = document.getElementById("registerBox");

    // Si ya está abierto → cerrar
    if (!loginBox.classList.contains("hidden")) {
        loginBox.classList.add("hidden");
        return;
    }

    // Abrir login y cerrar registro
    loginBox.classList.remove("hidden");
    registerBox.classList.add("hidden");
}

function showRegister() {

    const registerBox = document.getElementById("registerBox");
    const loginBox = document.getElementById("loginBox");

    // Si ya está abierto → cerrar
    if (!registerBox.classList.contains("hidden")) {
        registerBox.classList.add("hidden");
        return;
    }

    // Abrir registro y cerrar login
    registerBox.classList.remove("hidden");
    loginBox.classList.add("hidden");
}
// Validar que el correo sea @info.uas.edu.mx
function isInstitutionalEmail(email) {
    const pattern = /^[a-zA-Z0-9._%+-]+@(info\.uas\.edu\.mx|ms\.uas\.edu\.mx|uas\.edu\.mx)$/;
    return pattern.test(email);
}

// MANEJO DEL REGISTRO
async function handleRegister(e) {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const pass = document.getElementById('password').value;
    const rep = document.getElementById('confirmpassword').value;

    // 1. Validar correo institucional
    if (!isInstitutionalEmail(email)) {
        alert("¡Error! Debes usar un correo institucional válido (@info.uas.edu.mx, @ms.uas.edu.mx o @uas.edu.mx)");
        return;
    }

    // 2. Validar que las contraseñas coincidan
    if (pass !== rep) {
        alert("Las contraseñas no coinciden.");
        return;
    }

    // 3. Enviar datos al Backend (Spring Boot)
    try {
        const response = await fetch("/api/users/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                fullName: name,
                email: email,
                password: pass
            })
        });

        if (response.ok) {
            mostrarMensajeBienvenida(name);
        } else {
            const errorText = await response.text();
            alert("Error en el registro: " + errorText);
        }
    } catch (error) {
        console.error("Error al conectar con el servidor:", error);
        alert("No se pudo conectar con el servidor de Spring Boot.");
    }
}

async function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById("loginEmail").value;
    const password = document.querySelector("#loginBox input[type='password']").value;

    try {
        const response = await fetch("/api/users/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });

        if (response.ok) {

    const user = await response.json();

    // GUARDAR USUARIO COMPLETO
    localStorage.setItem(
        "usuarioLogueado",
        JSON.stringify({
            nombre: user.fullName,
            correo: user.email
        })
    );

    window.location.href = "Pagina principal.html";

} else {

    alert("Credenciales inválidas. Verifica tu correo y contraseña.");

}
    } catch (error) {
        console.error("Error en el login:", error);
        alert("El servidor no responde.");
    }
}

function mostrarMensajeBienvenida(name) {
    const box = document.getElementById('welcomeBox');
    box.textContent = `¡Bienvenido ${name} a UASFLIX! 🎬`;
    box.classList.add('show');

    document.querySelector("#registerBox form").reset();

    setTimeout(() => {
        box.classList.remove('show');
        showLogin(); // Regresar al login después de registrarse
    }, 4000);
}

// ===============================
// FOOTER → SCROLL + HIGHLIGHT
// ===============================
document.querySelectorAll('.footer-links a').forEach(link => {
    link.addEventListener('click', function (e) {
        e.preventDefault();

        const id = this.getAttribute('href');
        const seccion = document.querySelector(id);

        if (!seccion) return;

        const titulo = seccion.querySelector('.titulo-seccion');

        // 🔥 abrir esa sección (sin cerrar otras)
        seccion.classList.add('activa');

        // 🔥 scroll suave
        seccion.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });

        // 🔥 limpiar highlights
        document.querySelectorAll('.titulo-seccion').forEach(t => {
            t.classList.remove('highlight');
        });

        // 🔥 aplicar highlight correctamente (NEÓN REAL)
       setTimeout(() => {
        if (titulo) {

        // 🔥 REINICIAR animación SIEMPRE
        titulo.classList.remove('highlight');
        void titulo.offsetWidth; // ⚠️ clave para que vuelva a animar
        titulo.classList.add('highlight');

    }
}, 700);
    });
});
