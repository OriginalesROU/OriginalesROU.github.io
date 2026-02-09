const ITEMS_POR_PAGINA = 4;
let productos = [];
let paginaActual = 1;

// Cambia este número por tu WhatsApp real (formato internacional sin + ni espacios)
const WHATSAPP_NUMERO = "59812345678";

async function cargarProductos() {
  const respuesta = await fetch('productos.txt');
  const texto = await respuesta.text();
  productos = texto.trim().split('\n').map(linea => {
    const [id, nombre, imagenes, precio, descuento, precioDesc] = linea.split('|').map(x => x.trim());
    return {
      id,
      nombre,
      imagenes: imagenes.split(','),
      precio,
      descuento,
      precioDesc
    };
  });
  mostrarPagina(1);
}

function mostrarPagina(numPagina) {
  paginaActual = numPagina;
  const inicio = (numPagina - 1) * ITEMS_POR_PAGINA;
  const fin = inicio + ITEMS_POR_PAGINA;
  const paginaProductos = productos.slice(inicio, fin);

  const contenedor = document.getElementById('catalogo');
  contenedor.innerHTML = '';

  paginaProductos.forEach(prod => {
    const div = document.createElement('div');
    div.className = 'item';

    // Carrusel de imágenes
    let indiceImg = 0;
    const imgContainer = document.createElement('div');
    imgContainer.className = 'carousel';

    const imagen = document.createElement('img');
    imagen.src = '/productos/' + prod.imagenes[indiceImg].trim();
    imgContainer.appendChild(imagen);

    // Indicador de posición
    const indicador = document.createElement('div');
    indicador.className = 'indicador';
    indicador.textContent = `${indiceImg + 1}/${prod.imagenes.length}`;
    imgContainer.appendChild(indicador);

    if (prod.imagenes.length > 1) {
      const prevBtn = document.createElement('button');
      prevBtn.className = 'prev';
      prevBtn.textContent = '◀';
      prevBtn.onclick = () => {
        indiceImg = (indiceImg - 1 + prod.imagenes.length) % prod.imagenes.length;
        imagen.src = '/productos/' + prod.imagenes[indiceImg].trim();
        indicador.textContent = `${indiceImg + 1}/${prod.imagenes.length}`;
      };

      const nextBtn = document.createElement('button');
      nextBtn.className = 'next';
      nextBtn.textContent = '▶';
      nextBtn.onclick = () => {
        indiceImg = (indiceImg + 1) % prod.imagenes.length;
        imagen.src = '/productos/' + prod.imagenes[indiceImg].trim();
        indicador.textContent = `${indiceImg + 1}/${prod.imagenes.length}`;
      };

      imgContainer.appendChild(prevBtn);
      imgContainer.appendChild(nextBtn);
    }

    div.appendChild(imgContainer);

    // nombre
    const titulo = document.createElement('h2');
    titulo.textContent = prod.nombre;
    div.appendChild(titulo);

    // precio habitual
    const precio = document.createElement('p');
    precio.className = 'precio';
    precio.textContent = `Precio: $${prod.precio}`;
    div.appendChild(precio);

    // descuento (solo si > 0)
    if (prod.descuento !== '0%') {
      const desc = document.createElement('p');
      desc.className = 'descuento';
      desc.textContent = `Descuento: ${prod.descuento} → $${prod.precioDesc}`;
      div.appendChild(desc);
    }

    // Botón WhatsApp con ícono + texto
    const btnWhatsApp = document.createElement('a');
    btnWhatsApp.className = 'whatsapp-btn';
    btnWhatsApp.href = `https://wa.me/${WHATSAPP_NUMERO}?text=Hola,%20quiero%20consultar%20por%20el%20producto:%20${encodeURIComponent(prod.nombre)}`;
    btnWhatsApp.target = "_blank";

    const icono = document.createElement('img');
    icono.src = '/productos/whatsapp.jpeg'; // ícono de WhatsApp
    icono.alt = 'WhatsApp';

    const texto = document.createElement('span');
    texto.textContent = "Consultar";

    btnWhatsApp.appendChild(icono);
    btnWhatsApp.appendChild(texto);

    div.appendChild(btnWhatsApp);

    contenedor.appendChild(div);
  });

  generarPaginador();
}

function generarPaginador() {
  const totalPaginas = Math.ceil(productos.length / ITEMS_POR_PAGINA);
  const paginador = document.getElementById('paginador');
  paginador.innerHTML = '';

  for (let i = 1; i <= totalPaginas; i++) {
    const boton = document.createElement('button');
    boton.textContent = i;
    if (i === paginaActual) boton.classList.add('active');
    boton.onclick = () => mostrarPagina(i);
    paginador.appendChild(boton);
  }
}

cargarProductos();
