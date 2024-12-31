export const setupAddToCart= (button, cartId)=> {
    button.addEventListener("click", () => {
        const productId = button.getAttribute("data-product-id");
        console.log("Producto agregado al carrito:", productId);

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
                console.error("Error al agregar al carrito:", error.message);
            });
    });
};
//no entiendo xq no puedo exportar esta funcion a mi carpeta de js ! ! !