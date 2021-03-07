// Referencia html
const txtUid = document.querySelector('#txtUid');
const txtmensaje = document.querySelector('#txtmensaje');
const ulUsuarios = document.querySelector('#ulUsuarios');
const ulMensajes = document.querySelector('#ulMensajes');
const btnSalir = document.querySelector('#btnSalir');


let usuario = null;
let socket = null;
let url = (window.location.hostname.includes('localhost')) ?
    'http://localhost:8080/api/auth/' :
    'https://restserver-curso-david.herokuapp.com/api/auth/';
const validarJWT = async() => {
    const token = localStorage.getItem('token') || '';

    if (token.length <= 10) {
        window.location = 'index.html';
        throw new Error('No hay token en el servidor');
    }

    const resp = await fetch(url, {
        headers: { 'x-token': token },
    });

    const { usuario: usuarioDB, token: tokenDB } = await resp.json();
    localStorage.setItem('token', tokenDB);
    usuario = usuarioDB;
    document.title = usuario.nombre;
    await conectarSocket();
}

const conectarSocket = async() => {
    socket = io({
        'extraHeaders': {
            'x-token': localStorage.getItem('token')
        }
    });

    socket.on('connect', () => {
        console.log('Socket en linea');
    });

    socket.on('disconnect', () => {
        console.log('Socket desconectado');
    });

    socket.on('recibir-mensajes', dibujarMensajes);

    socket.on('usuarios-activos', dibujarUsuarios);
    socket.on('mensajes-privados', dibujarMensajesPrivados);
};

const dibujarUsuarios = (usuario = []) => {
    let usersHtml = '';
    usuario.forEach(({ nombre, uid }) => {
        usersHtml += `
            <li>
                <P>
                    <h5 class="text-success">${nombre}</h5>
                    <span class="fs-6 text-muted">${uid}</span>
                </p>
            </li>
        `;
    });

    ulUsuarios.innerHTML = usersHtml;
};

txtmensaje.addEventListener('keyup', ({ keyCode }) => {
    const mensaje = txtmensaje.value;
    const uid = txtUid.value;
    if (keyCode !== 13) {
        return;
    }
    if (mensaje.length <= 0) {
        return;
    }

    socket.emit('enviar-mensaje', { mensaje: mensaje.trim(), uid });
    txtmensaje.value = '';

});

const dibujarMensajes = (mensaje = []) => {
    let mensajeHtml = '';
    mensaje.forEach(({ nombre, mensaje }) => {
        mensajeHtml += `
            <li>
                <P>
                    <h5 class="text-primary">${nombre}:</h5>
                    <span>${mensaje}</span>
                </p>
            </li>
        `;
    });

    ulMensajes.innerHTML = mensajeHtml;
};

const dibujarMensajesPrivados = ({ de, mensaje }) => {
    let mensajeHtml = '';

    mensajeHtml += `
        <li>
            <P>
                <h5 class="text-primary">${de}:</h5>
                <span>${mensaje}</span>
            </p>
        </li>
    `;


    ulMensajes.innerHTML = mensajeHtml;
};

const main = async() => {
    await validarJWT();
};

main();