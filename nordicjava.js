const TIEMPO_VISIBLE = 4000; 

const bienvenida = document.getElementById("bienvenida");

setTimeout(() => {
  bienvenida.classList.add("oculta");         
  document.body.classList.remove("cargando");
}, TIEMPO_VISIBLE);


bienvenida.addEventListener("transitionend", (e) => {
  if (e.propertyName === "opacity") bienvenida.style.display = "none";
});

const ruta = getComputedStyle(bienvenida).backgroundImage.replace(/^url\(["']?|["']?\)$/g, "");
const prueba = new Image();
prueba.onerror = () => console.error("No se encontró la imagen de fondo en: " + ruta);
prueba.src = ruta;








document.querySelectorAll(".producto img").forEach(img => {
    img.onclick = function () {
        this.classList.toggle("ampliada");
    };
});

const imagenesGaleria = [
    ...document.querySelectorAll(".producto-imagen img")
];

const galeria = document.createElement("div");
galeria.id = "galeria";

galeria.innerHTML = `
    <button class="galeria-cerrar" aria-label="Cerrar">&times;</button>
    <button class="galeria-flecha galeria-anterior"
        aria-label="Imagen anterior">&#10094;</button>
    <img class="galeria-foto" src="" alt="Imagen ampliada">
    <button class="galeria-flecha galeria-siguiente"
        aria-label="Imagen siguiente">&#10095;</button>
`;

document.body.appendChild(galeria);

const fotoGaleria = galeria.querySelector(".galeria-foto");
let indiceGaleria = 0;

function mostrarGaleria(indice) {
    indiceGaleria =
        (indice + imagenesGaleria.length) % imagenesGaleria.length;

    fotoGaleria.src = imagenesGaleria[indiceGaleria].src;
    fotoGaleria.alt =
        imagenesGaleria[indiceGaleria].alt || "Imagen ampliada";

    galeria.style.display = "flex";
    document.body.style.overflow = "hidden";
}

function cerrarGaleria() {
    galeria.style.display = "none";
    document.body.style.overflow = "";
}

imagenesGaleria.forEach((imagen, indice) => {
    imagen.addEventListener("click", () => {
        mostrarGaleria(indice);
    });
});

galeria.querySelector(".galeria-cerrar")
    .addEventListener("click", cerrarGaleria);

galeria.querySelector(".galeria-anterior")
    .addEventListener("click", () => {
        mostrarGaleria(indiceGaleria - 1);
    });

galeria.querySelector(".galeria-siguiente")
    .addEventListener("click", () => {
        mostrarGaleria(indiceGaleria + 1);
    });

galeria.addEventListener("click", evento => {
    if (evento.target === galeria) cerrarGaleria();
});

document.addEventListener("keydown", evento => {
    if (galeria.style.display !== "flex") return;

    if (evento.key === "Escape") cerrarGaleria();
    if (evento.key === "ArrowRight") {
        mostrarGaleria(indiceGaleria + 1);
    }
    if (evento.key === "ArrowLeft") {
        mostrarGaleria(indiceGaleria - 1);
    }
});



// =====================================
// FORMULARIO DE RESERVA DE CITAS
// =====================================

document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("formCita");
    const estado = document.getElementById("citaEstado");

    if (!form || !estado) {
        console.error("No se encontró el formulario o el mensaje de estado.");
        return;
    }

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        // Validar los campos obligatorios
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        const boton = form.querySelector('button[type="submit"]');

        // Guardar los datos antes de limpiar el formulario
        const datos = new FormData(form);
        const nombre = datos.get("nombre");
        const fecha = datos.get("fecha");
        const hora = datos.get("hora");

        // Evitar envíos repetidos mientras se procesa la solicitud
        if (boton.disabled) return;

        boton.disabled = true;
        boton.textContent = "Reservando...";
        estado.textContent = "Procesando tu reserva...";

        try {
            const respuesta = await fetch("guardar_cita.php", {
                method: "POST",
                body: datos
            });

            const resultado = await respuesta.json();

            if (!respuesta.ok || !resultado.ok) {
                estado.textContent =
                    resultado.mensaje || "No se pudo registrar la cita.";

                // Mostrar horarios disponibles si PHP los devuelve
                if (resultado.horarios && resultado.horarios.length > 0) {
                    estado.textContent +=
                        " Horarios disponibles: " +
                        resultado.horarios.join(", ");
                }

                return;
            }

            // Reserva guardada correctamente
            estado.textContent =
                resultado.mensaje || "¡Tu cita fue reservada correctamente!";

            form.reset();

            alert(
                `¡Reserva confirmada, ${nombre}!\n\n` +
                `Fecha: ${fecha}\n` +
                `Hora: ${hora}\n\n` +
                "Gracias por contactarnos."
            );

        } catch (error) {
            console.error("Error al reservar la cita:", error);

            estado.textContent =
                "Error de conexión. Verifica que XAMPP esté funcionando e inténtalo nuevamente.";

        } finally {
            boton.disabled = false;
            boton.textContent = "Reservar cita";
        }
    });
});

