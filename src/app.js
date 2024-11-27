import express from "express";
import { config as configHandlebars } from "./config/handlebars.config.js";
import { config as configWebsocket } from "./config/websocket.config.js";
import routerProductos from "./routes/products.router.js";
import routerCarts from "./routes/carts.router.js";
import routerViewHome from "./routes/home.view.router.js";
const app = express();
const PORT = 8080;
app.use("/api/public", express.static("./src/public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
configHandlebars(app);
app.use("/api/productos", routerProductos);
app.use("/api/carritos", routerCarts);
app.use("/", routerViewHome);
const httpServer = app.listen(PORT, () => {
    console.log(`Ejecutándose en http://localhost:${PORT}`);
});
app.use("*", (req, res)=>{
    res.status(404).render("error404", { title: "error404" });
});
configWebsocket(httpServer);