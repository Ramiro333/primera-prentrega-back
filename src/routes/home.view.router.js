import { Router } from "express";
import ProductModel from "../models/product.model.js";
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
router.get("/carritos/:id", async (req, res) => {
    try {
        res.render("cart");
    } catch (error) {
        res.status(500).send(`<h1>Error</h1><h3>${error.message}</h3>`);
    }
});

export default router;