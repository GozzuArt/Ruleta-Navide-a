document.addEventListener('DOMContentLoaded', function () {

    // Configuración inicial de la ruleta
    const canvas = document.getElementById("ruleta");
    const ctx = canvas.getContext("2d");
    const hohohoBtn = document.getElementById("hohoho-btn");

    // Opciones de la ruleta
    const premios = [
        { nombre: "1 Pico Rico Gratis", descripcion: "Código: 1XMAS-MHV8 " },
        { nombre: "1 Pico Rico Gratis", descripcion: "Código: 2XMAS-IMV3" },
        { nombre: "1 Pico Rico Gratis", descripcion: "Código: 3XMAS-VVG6 " },
        { nombre: "Cono Crocante Gratis", descripcion: "Código: 4XMAS-EIN5 " },
        { nombre: "Cono Crocante Gratis", descripcion: "Código: 5XMAS-OZP4 " },
        { nombre: "2 Sombreros Gratis", descripcion: "Código: 6XMAS-KZE5" },
        { nombre: "Combo Doble Delicia Acapulco GRATIS", descripcion: "Código: 7XMAS-RJH0 " },
        { nombre: "Combo Doble Delicia Acapulco GRATIS", descripcion: "Código: 8XMAS-BPN9 " },
        { nombre: "Un Mes de Helado Gratis", descripcion: "Código: 9XMAS-RNG1  " },
        { nombre: "Súper Combo Navideño", descripcion: "Código: 10XMAS-WDG8 " },
        { nombre: "En la lista negra de Santa", descripcion: "Código: Te portaste mal este año" },
        { nombre: "En la lista negra de Santa", descripcion: "Código: Te portaste mal este año" },
        { nombre: "En la lista negra de Santa", descripcion: "Código: Te portaste mal este año" }
    ];
    

    const colores = [
        "#28a745", // Verde navideño
        "#d9534f", // Rojo navideño
        "#28a745", // Verde navideño
        "#d9534f", // Rojo navideño
        "#28a745", // Verde navideño
        "#2f3a44", // Súper raro (Súper Combo Navideño)
        "#d9534f", // Rojo navideño
        "#28a745", // Verde navideño
        "#d9534f", // Rojo navideño
        "#2f3a44", // Súper raro (Un Mes de Helado Gratis)
        "#28a745", // Verde navideño
        "#d9534f", // Rojo navideño
        "#28a745"  // Verde navideño
    ];
    
    

    let anguloInicio = 0;
    let girando = false;

    // Dibujar la ruleta
    function dibujarRuleta() {
        const numPremios = premios.length;
        const angulo = (2 * Math.PI) / numPremios;

        for (let i = 0; i < numPremios; i++) {
            const inicio = angulo * i;
            const fin = angulo * (i + 1);

            ctx.beginPath();
            ctx.moveTo(canvas.width / 2, canvas.height / 2);
            ctx.arc(canvas.width / 2, canvas.height / 2, canvas.width / 2, inicio, fin);
            ctx.closePath();
            ctx.fillStyle = colores[i];
            ctx.fill();
            ctx.strokeStyle = "#000";
            ctx.stroke();

            ctx.save();
            ctx.translate(
                canvas.width / 2 + Math.cos(inicio + angulo / 2) * (canvas.width / 2.5),
                canvas.height / 2 + Math.sin(inicio + angulo / 2) * (canvas.height / 2.5)
            );
            ctx.rotate(inicio + angulo / 2);
            ctx.fillStyle = "white";
            ctx.font = "bold 14px Arial";
            ctx.fillText(" ", 0, 0); // No hay texto ahora
            ctx.restore();
          }
          dibujarCentro();
        }
      

    // Dibujar el centro de la ruleta
    function dibujarCentro() {
        ctx.beginPath();
        ctx.arc(canvas.width / 2, canvas.height / 2, 5, 0, 2 * Math.PI);
        ctx.fillStyle = "#000";
        ctx.fill();
    }

    // Girar la ruleta
    function girarRuleta() {
        if (girando) return;
        girando = true;

        const giroFinal = Math.random() * (360 * 5) + 360; // 5 vueltas completas más un ángulo adicional
        const velocidad = giroFinal / 100; // Control de velocidad
        let progreso = 0;

        function animar() {
            progreso += velocidad;
            anguloInicio += velocidad * (Math.PI / 180); // Convertir grados a radianes
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.save();
            ctx.translate(canvas.width / 2, canvas.height / 2);
            ctx.rotate(anguloInicio);
            ctx.translate(-canvas.width / 2, -canvas.height / 2);
            dibujarRuleta();
            ctx.restore();
            if (progreso < giroFinal) {
              requestAnimationFrame(animar);
            } else {
              girando = false;
              determinarPremio();
            }
          }
      
          animar();
        }

    // Determinar el premio
    function determinarPremio() {
        const anguloGrados = (360 - (anguloInicio * (180 / Math.PI)) % 360) % 360;
        const anguloPorPremio = 360 / premios.length;
        const indice = Math.floor(anguloGrados / anguloPorPremio);

        mostrarModal(premios[indice].nombre, premios[indice].descripcion);
    }

    // Mostrar el modal con el premio y su descripción
    function mostrarModal(titulo, descripcion) {
        const modal = document.getElementById('modal-overlay');
        const modalTitulo = document.getElementById('modal-titulo');
        const modalDescripcion = document.getElementById('modal-descripcion');
        const botonCerrar = document.getElementById('cerrar-modal');

        modalTitulo.textContent = titulo;
        modalDescripcion.textContent = descripcion;

        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden'; // Deshabilitar scroll al abrir el modal

        // Redirigir al inicio al cerrar el modal
        botonCerrar.addEventListener('click', function () {
            window.location.href = '/'; // Redirigir al inicio
        });
        botonCerrar.addEventListener('click', function () {
            modal.style.display = 'none'; // Cerrar modal sin redirigir
            document.body.style.overflow = ''; // Rehabilitar scroll
        });

    }

    // Inicializar la ruleta
    dibujarRuleta();

    // Eventos
    hohohoBtn.addEventListener("click", girarRuleta);

});
