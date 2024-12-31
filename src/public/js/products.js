const productsList = document.getElementById("products-list");
const botonAscendente = document.getElementById("boton-ascendente");
const botonDescendente = document.getElementById("boton-descendente");

const loadProductsList = async (sort) => {
    const response = await fetch(`/api/productos?sort=${sort}`, { method: "GET" });
    if (!response.ok) throw new Error("Error al obtener los productos");
    const data = await response.json();
    const products = data.payload.docs ?? [];
    console.log(data.payload.docs)
    productsList.innerHTML = "";

    products.forEach((product) => {
        productsList.innerHTML += `
            <li>
                Name: ${product.title}<br>
                -Id: ${product.id}<br>
                -Description: ${product.description}<br>
                -Price: ${product.price}<br>
                -Stock: ${product.stock}<br>
                -Category: ${product.category}
            </li>
            <button class="add-to-cart" data-product-id="${product.id}">agregar al carrito</button>
            <button class="boton-eliminar-del-carrito">eliminar del carrito</button>
            <a href="/producto/${product.id}"><button class="boton-detalle">Ver detalles</button></a>
        `;
    });

    const addToCartButtons = document.querySelectorAll(".add-to-cart");
    const removeButtons = document.querySelectorAll(".boton-eliminar-del-carrito");

    addToCartButtons.forEach((addToCartButton) => {
        addToCartButton.addEventListener("click", () => {
            const productId = addToCartButton.getAttribute("data-product-id");
            const cartId = "67623e3c27826dab333439b9";
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
    });

    removeButtons.forEach((removeButton) => {
        removeButton.addEventListener("click", () => {
            console.log("Eliminar del carrito");
        });
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