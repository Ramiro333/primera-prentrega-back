const cartList = document.querySelector(".carts_list");
const deatilContainer = document.querySelector(".details");
const loadCart = async ()=>{
    const response = await fetch("/api/carritos/67623e3c27826dab333439b9", { method: "GET" });
    if(!response.ok) throw new Error("error al cargar el carrito");
    const data = await response.json();
    const carts = data.payload.products ;
    console.log(carts);
    console.log(carts[0]);
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
loadCart();