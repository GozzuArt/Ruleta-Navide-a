document.addEventListener('DOMContentLoaded', function () {

    // Manejo del formulario de correo
    document.getElementById('formulario').addEventListener('submit', async (e) => {
        e.preventDefault();

        const correo = document.getElementById('correo').value;

        // Validación de correo
        if (!validateEmail(correo)) {
            mostrarModal('Por favor ingresa un correo válido.');
            return;
        }

        // Deshabilitar el botón mientras se envía
        const boton = document.querySelector('button');
        boton.disabled = true;
        boton.textContent = 'Enviando...';

        try {
            const respuesta = await fetch('/enviar-correo', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ correo })
            });

            if (!respuesta.ok) {
                const mensaje = await respuesta.text();
                mostrarModal(mensaje);
                return;
            }

            mostrarModal('¡Correo enviado! Revisa tu bandeja para tu código de verificación.');
        } catch (error) {
            mostrarModal('Hubo un error al enviar el correo. Intenta nuevamente.');
        } finally {
            boton.disabled = false;
            boton.textContent = 'Participar';
        }
    });

    // Validación del correo
    function validateEmail(email) {
        const re = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        return re.test(email);
    }

    // Mostrar modal
    function mostrarModal(mensaje) {
        const modal = document.getElementById('modal');
        const modalTexto = document.getElementById('modal-texto');
        modalTexto.textContent = mensaje;
        modal.style.display = 'block';
    }

    // Cerrar modal y redirigir
    document.getElementById('cerrar-modal').addEventListener('click', () => {
        document.getElementById('modal').style.display = 'none';
        window.location.href = '/verificar-codigo.html'; // Redirigir a la página de verificación
    });


});
