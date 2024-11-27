const productsList = document.getElementById("products-list");
const loadProductsList = async () => {
    const response = await fetch("/api/productos", { method: "GET" });
    const data = await response.json();
    const products = data.payload || [];
    productsList.innerText = "";
    products.forEach((product) => {
        productsList.innerHTML += `<li>Id: ${product.id} - Name: ${product.title}</li>`;
    });
};

loadProductsList();