
const cards = document.getElementById("cards");
const itemsCarrito = document.getElementById("itemsCarrito");
const templateCard = document.getElementById("templateCard").content;
const templateFooter = document.getElementById("templateFooter").content;
const templateCarrito = document.getElementById("templateCarrito").content;
const fragment = document.createDocumentFragment();
let carrito = {};
let wishList = {};

document.addEventListener("DOMContentLoaded", () => {
  fetchData();
  if (localStorage.getItem("carrito")) {
    carrito = JSON.parse(localStorage.getItem("carrito"));
    disenioCarrito();
  }
});
cards.addEventListener("click", (e) => {
  agregarAlCarrito(e);
});
itemsCarrito.addEventListener("click", (e) => {
  btnAccion(e);
});

btnMenu.addEventListener("click", () => {
  const menuItems = document.querySelector(".menuItems");
  menuItems.classList.toggle("show");
});

const fetchData = async () => {
  try {
    const res = await fetch("api.json");
    const data = await res.json();
    pintarCards(data);
  } catch (error) {}
};

const pintarCards = (data) => {
  data.forEach((producto) => {
    templateCard.querySelector(".title").textContent = producto.title;
    templateCard.querySelector(".precio").textContent = producto.precio;
    templateCard.querySelector("img").setAttribute("src", producto.img);
    templateCard.querySelector(".btnAgregarCarrito").dataset.id = producto.id;
    const clone = templateCard.cloneNode(true);
    fragment.appendChild(clone);
  });
  cards.appendChild(fragment);
};

const agregarAlCarrito = (e) => {
  if (e.target.classList.contains("btnAgregarCarrito")) {
    Swal.fire(
      {
  title:'comprado',
  text:'haz agregado un productoa tu carrito',
  icon:'success',
  confirmButtonText:'gracias por su compra',
  position:'center'
  
      }
  ) 
    setCarrito(e.target.parentElement.parentElement.parentElement);
  }
  e.stopPropagation();
};

const setCarrito = (objeto) => {
  const producto = {
    img: objeto.querySelector(".itemImg").src,
    id: objeto.querySelector(".btnAgregarCarrito").dataset.id,
    title: objeto.querySelector(".title").textContent,
    precio: objeto.querySelector(".precio").textContent,
    cantidad: 1,
  };
  if (carrito.hasOwnProperty(producto.id)) {
    producto.cantidad = carrito[producto.id].cantidad + 1;
  }
  carrito[producto.id] = { ...producto };
  disenioCarrito();
};

const disenioCarrito = () => {
  itemsCarrito.innerHTML = "";
  Object.values(carrito).forEach((producto) => {
    templateCarrito.querySelector(".imgCarrito").src = producto.img;
    templateCarrito.querySelectorAll("td")[1].textContent = producto.title;
    templateCarrito.querySelectorAll("td")[2].textContent = producto.cantidad;
    templateCarrito.querySelector("span").textContent =
      producto.precio * producto.cantidad;

    templateCarrito.querySelector(".btnAdd").dataset.id = producto.id;
    templateCarrito.querySelector(".btnDelete").dataset.id = producto.id;

    const clone = templateCarrito.cloneNode(true);
    fragment.appendChild(clone);
  });
  itemsCarrito.appendChild(fragment);

  disenioFooter();
  localStorage.setItem("carrito", JSON.stringify(carrito));
};
const disenioFooter = () => {
  footer.innerHTML = "";
  if (Object.keys(carrito).length === 0) {
    footer.innerHTML = `<th scope="row" colspan="5">Carrito vacío</th>`;
    return;
  }
  const nCantidad = Object.values(carrito).reduce(
    (acc, { cantidad }) => acc + cantidad,
    0
  );
  const nPrecio = Object.values(carrito).reduce(
    (acc, { cantidad, precio }) => acc + cantidad * precio,
    0
  );

  templateFooter.querySelectorAll("td")[0].textContent = nCantidad;
  templateFooter.querySelector("span").textContent = nPrecio;

  const clone = templateFooter.cloneNode(true);
  fragment.appendChild(clone);
  footer.appendChild(fragment);

  const vaciarCarrito = document.getElementById("vaciarCarrito");
  vaciarCarrito.addEventListener("click", () => {
    Swal.fire({


      title:'elimando..',
      text:'se eliminaran los productos del carrito',
      icon:'warning',
      iconColor:'#FA9191',
        position:'top-center',
        timer: 2500,
        
    });
    carrito = {};
    disenioCarrito();
  });
  const comprarCarrito = document.getElementById("comprarCarrito");
  comprarCarrito.addEventListener("click", () => {
    Swal.fire({
      position: "center",
      icon: "success",
      title: "Gracias por su compra",
      showConfirmButton: false,
      timer: 1500,
    });
  });
};
const btnAccion = (e) => {
  if (e.target.classList.contains("btnAdd")) {
    const producto = carrito[e.target.dataset.id];
    producto.cantidad++;
    
    carrito[e.target.dataset.id] = { ...producto };
    disenioCarrito();
  }
  if (e.target.classList.contains("btnDelete")) {
    const producto = carrito[e.target.dataset.id];
    producto.cantidad--;
   
    if (producto.cantidad === 0) {
      delete carrito[e.target.dataset.id];
    }
    disenioCarrito();
  }
  e.stopPropagation();
};