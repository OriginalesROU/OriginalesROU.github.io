const ITEMS_POR_PAGINA = 2;
let productos = [];
let paginaActual = 1;

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

    // imágenes
    prod.imagenes.forEach(img => {
      const imagen = document.createElement('img');
      imagen.src = 'productos/' + img;
      div.appendChild(imagen);
    });

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
