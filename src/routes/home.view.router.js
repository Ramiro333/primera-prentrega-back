import { Router } from "express";
import ProductModel from "../models/product.model.js";
// import CartModel from "../models/cart.model.js";
import CartManager from "../managers/CartManager.js";
const cartManager = new CartManager();
const router = Router();
router.get("/", async (req, res) => {
    try {
        res.render("home", { title: "Inicio" });
    } catch (error) {
        res.status(500).send(`<h1>Error</h1><h3>${error.message}</h3>`);
    }
});
router.get("/producto/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const product = await ProductModel.findById(id).lean();
        if (!product) {
            return res.status(404).send("<h1>Error</h1><h3>Producto no encontrado</h3>");
        }
        res.render("productDetail", { title: "Detalle del Producto", product });
    } catch (error) {
        res.status(500).send(`<h1>Error</h1><h3>${error.message}</h3>`);
    }
});
router.get("/realTimeProducts", async (req, res) => {
    try {
        res.render("realTimeProducts", { title: "product list" });
    } catch (error) {
        res.status(500).send(`<h1>Error</h1><h3>${error.message}</h3>`);
    }
});
router.get("/carts/:id", async (req, res) => {
    try {
        const cart = await cartManager.getOneById(req.params.id);
        console.log('Cart Data:', cart);  // Agrega este log
        res.render('cart', { cart: cart });
    } catch (error) {
        res.status(500).send(`<h1>Error</h1><h3>${error.message}</h3>`);
    }
});

export default router;