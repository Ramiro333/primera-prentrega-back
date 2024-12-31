const socket = io();
const productsList = document.getElementById("products-list");
const productsForm = document.getElementById("products-form");
const inputProductId = document.getElementById("input-product-id");
const btnDeleteProduct = document.getElementById("btn-delete-product");
const errorMessage = document.getElementById("error-message");
const botonAscendente = document.getElementById("boton-ascendente");
const botonDescendente = document.getElementById("boton-descendente");
socket.on("products-list", (data) => {
    const products = data.products.docs ?? [];
    productsList.innerText = "";
    products.forEach((product) => {
        productsList.innerHTML += `<li>Name: ${product.title}<br>-Id: ${product.id}<br> -Description: ${product.description}<br>-Price: ${product.price}<br>-Stock: ${product.stock}<br>-Category: ${product.category}</li>`;
    });
});
productsForm.onsubmit = (event) => {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);
    errorMessage.innerText = "";
    form.reset();
    socket.emit("insert-product", {
        title: formData.get("title"),
        description: formData.get("description"),
        code: formData.get("code"),
        price: formData.get("price"),
        status: formData.get("status") || "off",
        stock: formData.get("stock"),
        category: formData.get("category"),
    });
};
btnDeleteProduct.onclick = () => {
    const id = inputProductId.value;
    inputProductId.value = "";
    errorMessage.innerText = "";
    if (id) {
        socket.emit("delete-product", { id });
    } else {
        errorMessage.innerText = "Invalid ID, cannot delete the product";
    }
};
botonAscendente.onclick = (e)=>{
    e.preventDefault();
    const sort = botonAscendente.value;
    socket.emit("get-products", { sort });
};
botonDescendente.onclick = (e)=>{
    e.preventDefault();
    const sort = botonDescendente.value;
    socket.emit("get-products", { sort });
};
socket.on("error-message", (data) => {
    errorMessage.innerText = data.message;
});