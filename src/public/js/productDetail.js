const addToCartButton = document.getElementById("add-to-cart");

addToCartButton.addEventListener("click", () => {
    const productId = addToCartButton.getAttribute("data-product-id");
    console.log("Producto agregado al carrito:", productId);
    const requestBody = {
        products: [
            {
                product: productId,
                quantity: 1,
            },
        ],
    };
    fetch("/api/carritos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
    })
        .then((response) => response.json())
        .then((data) => {
            if (data.status === "success") {
                alert("Producto agregado al carrito con éxito!");
            } else {
                alert("Error al agregar al carrito: " + data.message);
            }
        })
        .catch((error) => {
            console.error(error.message);
        });
});