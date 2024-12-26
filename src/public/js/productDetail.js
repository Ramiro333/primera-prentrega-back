const addToCartButton = document.querySelector(".add-to-cart");
const cartId = "67623e3c27826dab333439b9";
addToCartButton.addEventListener("click", () => {
    const productId = addToCartButton.getAttribute("data-product-id");
    console.log("Producto agregado al carrito:", cartId);
    const requestBody = {
        products: [
            {
                product: productId,
                quantity: 1,
            },
        ],
    };
    fetch(`/api/carritos/${cartId}/productos/${productId}`, {
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