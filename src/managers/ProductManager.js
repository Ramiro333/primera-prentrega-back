import paths from "../utils/paths.js";
import { readJsonFile, writeJsonFile, deleteFile } from "../utils/fileHandler.js";
import { generateId } from "../utils/collectionHandler.js";
import { convertToBoolean } from "../utils/converter.js";
import ErrorManager from "./ErrorManager.js";

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
            throw new ErrorManager("ID:"+id+" doesn't exist", 404);
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
                throw new ErrorManager("Incomplete fields", 400);
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
                thumbnail: file?.filename || "no image",
            };
            this.#productos.push(producto);
            await writeJsonFile(paths.files, this.#jsonFilename, this.#productos);
            return producto;
        } catch (error) {
            if (file?.filename) await deleteFile(paths.images, file.filename);
            throw new ErrorManager(error.message, error.code);
        }
    }
    async updateOneById(pid, data, file) {
        try {
            const { title, description, code, price, status, stock, category } = data;
            const productFound = await this.#findOneById(pid);
            const newThumbnail = file?.filename;
            const product = {
                id: productFound.id,
                title: title || productFound.title,
                description: description || productFound.description,
                code: code || productFound.code,
                price: price ? Number(price) : productFound.price,
                status: status ? convertToBoolean(status) : productFound.status,
                stock: stock ? Number(stock) : productFound.stock,
                category: category||productFound.category,
                thumbnail: newThumbnail || productFound.thumbnail,
            };
            if (file?.filename && newThumbnail !== productFound.thumbnail) {
                await deleteFile(paths.images, productFound.thumbnail);
            }
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