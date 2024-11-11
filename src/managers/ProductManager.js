import paths from "../utils/paths.js";
import { readJsonFile, writeJsonFile, deleteFile } from "../utils/fileHandler.js";
import { generateId } from "../utils/collectionHandler.js";
import { convertToBoolean } from "../utils/converter.js";
import ErrorManager from "./Error.manager.js";

export default class ProductManager {
    #jsonFilename;
    #productos;
    constructor() {
        this.#jsonFilename = "products.json";
    }
    async #findOneById(id) {
        this.#productos = await this.getAll();
        const productFound = this.#productos.find((item) => item.id === Number(id));
        if (!productFound) {
            throw new ErrorManager("no se encontró el producto con el ID"+id, 404);
        }
        return productFound;
    }

    async getAll() {
        try {
            this.#productos = await readJsonFile(paths.files, this.#jsonFilename);
            return this.#productos;
        } catch (error) {
            throw new ErrorManager(error.message, error.code);
        }
    }

    async getOneById(id) {
        try {
            const productFound = await this.#findOneById(id);
            return productFound;
        } catch (error) {
            throw new ErrorManager(error.message, error.code);
        }
    }

    async insertOne(data, file) {
        try {
            const { title, description, code, price, status, stock, category } = data;
            if (!title ||!description||!code||!price|| !status || !stock || !category) {
                throw new ErrorManager("Faltan datos obligatorios", 400);
            }
            const producto = {
                id: generateId(await this.getAll()),
                title,
                description,
                code,
                price,
                status: convertToBoolean(status) || true,
                stock: Number(stock),
                category,
            };
            this.#productos.push(producto);
            await writeJsonFile(paths.files, this.#jsonFilename, this.#productos);
            return producto;
        } catch (error) {
            if (file?.filename) await deleteFile(paths.images, file.filename);
            throw new ErrorManager(error.message, error.code);
        }
    }

    async updateOneById(pid, data) {
        try {
            console.log(pid, data);
            const { title, description, code, price, status, stock, category } = data;
            const productFound = await this.#findOneById(pid);
            const product = {
                id: productFound.id,
                title: title || productFound.title,
                description: description || productFound.description,
                code: code || productFound.code,
                price: price ? Number(price) : productFound.price,
                status: status ? convertToBoolean(status) : productFound.status,
                stock: stock ? Number(stock) : productFound.stock,
                category: category||productFound.category,
            };
            console.log(pid, data);
            const index = this.#productos.findIndex((item) => item.id === Number(pid));
            this.#productos[index] = product;
            await writeJsonFile(paths.files, this.#jsonFilename, this.#productos);
            return product;
        } catch (error) {
            throw new ErrorManager(error.message, error.code);
        }
    }

    async deleteOneById (id) {
        try {
            await this.#findOneById(id);
            const index = this.#productos.findIndex((item) => item.id === Number(id));
            this.#productos.splice(index, 1);
            await writeJsonFile(paths.files, this.#jsonFilename, this.#productos);
        } catch (error) {
            throw new ErrorManager(error.message, error.code);
        }
    }
}