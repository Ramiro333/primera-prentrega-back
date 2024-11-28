const productsList = document.getElementById("products-list");
const loadProductsList = async () => {
    const response = await fetch("/api/productos", { method: "GET" });
    const data = await response.json();
    const products = data.payload || [];
    productsList.innerText = "";
    console.log(products);
    products.forEach((product) => {
        productsList.innerHTML += `<li>Name: ${product.title}<br>-Id: ${product.id}<br> -Description: ${product.description}<br>-Price: ${product.price}<br>-Stock: ${product.stock}<br>-Category: ${product.category}</li>`;
    });
};

loadProductsList();