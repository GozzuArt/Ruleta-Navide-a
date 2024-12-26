document.getElementById('form-verificacion').addEventListener('submit', async (e) => {
    e.preventDefault();

    const codigoIngresado = document.getElementById('codigo').value;
    const correo = localStorage.getItem('correo'); // Recuperamos el correo almacenado previamente

    if (!correo || !codigoIngresado) {
        mostrarModal('Por favor ingresa un código válido.');
        return;
    }

    try {
        const respuesta = await fetch('/verificar-codigo', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ correo, codigo: codigoIngresado })
        });

        if (!respuesta.ok) {
            const mensaje = await respuesta.text();
            mostrarModal(mensaje); // Mostrar el mensaje de error
            return;
        }

        mostrarModal('¡Código verificado correctamente! Ahora puedes participar en la Ruleta Navideña.');
    } catch (error) {
        mostrarModal('Hubo un error al verificar el código.');
    }
});

// Función para mostrar el modal
function mostrarModal(mensaje) {
    const modal = document.getElementById('modal');
    const modalTexto = document.getElementById('modal-texto');
    modalTexto.textContent = mensaje;
    modal.style.display = 'block';
}

// Cerrar el modal
document.getElementById('cerrar-modal').addEventListener('click', () => {
    document.getElementById('modal').style.display = 'none';
});
