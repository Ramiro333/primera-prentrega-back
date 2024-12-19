const productsList = document.getElementById("products-list");
const botonAscendente = document.getElementById("boton-ascendente");
const botonDescendente = document.getElementById("boton-descendente");
const loadProductsList = async (sort) => {
    const response = await fetch(`/api/productos?sort=${sort}`, { method: "GET" });
    if (!response.ok) throw new Error("Error al obtener los productos");
    const data = await response.json();
    const products = data.payload.docs ?? [];
    productsList.innerText = "";
    products.forEach((product) => {
        productsList.innerHTML += `<li>Name: ${product.title}<br>-Id: ${product.id}<br> -Description: ${product.description}<br>-Price: ${product.price}<br>-Stock: ${product.stock}<br>-Category: ${product.category}</li>        <button class="boton-agregar-carrito">agregar al carrito</button><button class="boton-eliminar-del-carrito">eliminar del carrito</button><button class="boton-detalle"><a href="/producto/${product.id}">Ver detalles</a></button>`;
    });
};

botonAscendente.addEventListener("click", (e) => {
    e.preventDefault();
    loadProductsList("asc");
});
botonDescendente.addEventListener("click", (e) => {
    e.preventDefault();
    loadProductsList("desc");
});
loadProductsList();