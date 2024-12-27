const cartList = document.querySelector(".carts_list");
const deatilContainer = document.querySelector(".details");
const deleteCart = document.querySelector(".delete-cart");
const loadCart = async ()=>{
    const response = await fetch("/api/carritos/67623e3c27826dab333439b9", { method: "GET" });
    if(!response.ok) throw new Error("error al cargar el carrito");
    const data = await response.json();
    const carts = data.payload.products ;
    cartList.innerHTML="";
    deatilContainer.innerHTML = `
    <h3>creado: ${data.payload.createdAt}<br>
        actualizado: ${data.payload.updatedAt}
    </h3>

    `;
    carts.forEach((item) => {
        cartList.innerHTML +=`
        <li>
            id:${item.product._id}
            name: ${item.product.title}
            quantity: ${item.quantity}
        </li>
        `;
    });

};
deleteCart.addEventListener("click", async () => {
    const cartId = "67623e3c27826dab333439b9";
    try {
        const response = await fetch(`/api/carritos/${cartId}`, { method: "DELETE" });
        if (!response.ok) throw new Error("Error al vaciar el carrito");
        cartList.innerHTML = "";
    } catch (error) {
        alert("Hubo un problema al vaciar el carrito: " + error.message);
    }
});
loadCart();