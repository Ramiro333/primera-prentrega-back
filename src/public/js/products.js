const productsList = document.getElementById("products-list");
const botonAscendente = document.getElementById("boton-ascendente");
const botonDescendente = document.getElementById("boton-descendente");
const prevPageButton = document.getElementById("prev-page");
const nextPageButton = document.getElementById("next-page");
const pageNumber = document.querySelector(".page-number");

const loadProductsList = async (sort, page = 1) => {
    const response = await fetch(`/api/productos?sort=${sort}&page=${page}`, { method: "GET" });
    if (!response.ok) throw new Error("Error al obtener los productos");
    const data = await response.json();
    const products = data.payload.docs ?? [];
    productsList.innerHTML = "";
    pageNumber.innerText= `numero de pagina: ${data.payload.page}`;
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
            <button class="boton-eliminar-del-carrito" data-product-id="${product.id}">eliminar del carrito</button>
            <a href="/producto/${product.id}"><button class="boton-detalle">Ver detalles</button></a>
        `;
    });

    const addToCartButtons = document.querySelectorAll(".add-to-cart");
    const removeButtons = document.querySelectorAll(".boton-eliminar-del-carrito");

    addToCartButtons.forEach((addToCartButton) => {
        addToCartButton.addEventListener("click", () => {
            const productId = addToCartButton.getAttribute("data-product-id");
            const cartId = "67623e3c27826dab333439b9";

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
    prevPageButton.disabled = !data.payload.hasPrevPage;
    nextPageButton.disabled = !data.payload.hasNextPage;
    removeButtons.forEach((removeButton) => {
        removeButton.addEventListener("click", async () => {
            const productId = removeButton.getAttribute("data-product-id");
            try {
                const response = await fetch(`/api/carritos/67623e3c27826dab333439b9/productos/${productId}`, {
                    method: "DELETE",
                });

                if (response.ok) {
                    alert("Producto eliminado del carrito con éxito.");
                } else {
                    const error = await response.json();
                    alert("Error al eliminar el producto: " + (error.message || "Error desconocido"));
                }
            } catch (error) {
                alert("Hubo un problema al eliminar el producto del carrito.");
                console.error(error);
            }
        });
    });
};
let currentPage = 1;
let currentSort = "asc";
prevPageButton.addEventListener("click", (e) => {
    e.preventDefault();
    if (currentPage > 1) {
        currentPage--;
        loadProductsList(currentSort, currentPage);
    }
});

nextPageButton.addEventListener("click", (e) => {
    e.preventDefault();
    currentPage++;
    loadProductsList(currentSort, currentPage);
});
botonAscendente.addEventListener("click", (e) => {
    e.preventDefault();
    currentSort = "asc";
    loadProductsList("asc", currentPage);
});

botonDescendente.addEventListener("click", (e) => {
    e.preventDefault();
    currentSort = "desc";
    loadProductsList("desc", currentPage);
});

loadProductsList(currentSort, currentPage);