import express from "express";
import routerProductos from "./routes/products.router.js";
import routerCarts from "./routes/carts.router.js";

const app = express();

const PORT = 8080;

app.use("/api/public", express.static("./src/public"));

app.use(express.urlencoded({ extended: true }));

app.use(express.json());

app.use("/api/productos", routerProductos);
app.use("/api/carritos", routerCarts);

app.listen(PORT, () => {
    console.log(`Ejecutándose en http://localhost:${PORT}`);
});