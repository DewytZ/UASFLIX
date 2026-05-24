function showLogin() {
    const loginBox = document.getElementById("loginBox");
    const registerBox = document.getElementById("registerBox");

    if (!loginBox.classList.contains("hidden")) {
        loginBox.classList.add("hidden");
        return;
    }

    loginBox.classList.remove("hidden");
    registerBox.classList.add("hidden");
}

function showRegister() {
    const registerBox = document.getElementById("registerBox");
    const loginBox = document.getElementById("loginBox");

    if (!registerBox.classList.contains("hidden")) {
        registerBox.classList.add("hidden");
        return;
    }

    registerBox.classList.remove("hidden");
    loginBox.classList.add("hidden");
}

// Validar que el correo sea de los dominios institucionales de la UAS
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

    if (!isInstitutionalEmail(email)) {
        alert("¡Error! Debes usar un correo institucional válido (@info.uas.edu.mx, @ms.uas.edu.mx o @uas.edu.mx)");
        return;
    }

    if (pass !== rep) {
        alert("Las contraseñas no coinciden.");
        return;
    }

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

// MANEJO DEL LOGIN
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

            // 1. Guardamos los datos individuales para el sistema de comentarios y estrellas
            localStorage.setItem("userName", user.fullName);
            localStorage.setItem("userEmail", user.email);

            // 2. Mantenemos tu guardado original por si lo usas en otros lados
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
        showLogin();
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

        seccion.classList.add('activa');

        seccion.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });

        document.querySelectorAll('.titulo-seccion').forEach(t => {
            t.classList.remove('highlight');
        });

        setTimeout(() => {
            if (titulo) {
                titulo.classList.remove('highlight');
                void titulo.offsetWidth; 
                titulo.classList.add('highlight');
            }
        }, 700);
    });
});