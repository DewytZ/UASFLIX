// ===============================
// SIDEBAR
// ===============================

const menuBtn = document.querySelector(".menu-btn");
const sidebar = document.getElementById("sidebar");

menuBtn.addEventListener("click", () => {

    sidebar.classList.toggle("active");

});

// ===============================
// TEMA
// ===============================

const btnTema = document.getElementById("btnTema");

btnTema.addEventListener("click", () => {

    document.body.classList.toggle("light-mode");

    localStorage.setItem(
        "theme",
        document.body.classList.contains("light-mode")
        ? "light"
        : "dark"
    );

});

// CARGAR TEMA
if(localStorage.getItem("theme") === "light"){

    document.body.classList.add("light-mode");

}

// ===============================
// DATOS DEL USUARIO
// ===============================

const usuario =
    JSON.parse(localStorage.getItem("usuarioLogueado"));

if(usuario){

    document.getElementById("username").textContent =
        usuario.nombre;

    document.getElementById("email").textContent =
        usuario.correo;

}else{

    // SI NO HAY SESIÓN
    window.location.href = "index.html";

}

// ===============================
// IR A INICIO
// ===============================

function goHome(){

    window.location.href = "Pagina principal.html";

}

// ===============================
// CERRAR SESIÓN
// ===============================

function logout(){

    localStorage.removeItem("usuarioLogueado");

    window.location.href = "index.html";

}
