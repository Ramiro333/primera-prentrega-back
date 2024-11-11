import paths from "../utils/paths.js";
import { readJsonFile, writeJsonFile } from "../utils/fileHandler.js";
import { generateId } from "../utils/collectionHandler.js";
import ErrorManager from "./Error.manager.js";

export default class CartManager {
    #jsonFilename;
    #carts;
    constructor() {
        this.#jsonFilename = "cart.json";
    }
    async #findOneById(id) {
        this.#carts = await this.getAll();
        const cartFound = this.#carts.find((item) => item.id === Number(id));
        if (!cartFound) {
            throw new ErrorManager("no se encontró el cart con el ID"+id, 404);
        }
        return cartFound;
    }

    async getAll() {
        try {
            this.#carts = await readJsonFile(paths.files, this.#jsonFilename);
            return this.#carts;
        } catch (error) {
            throw new ErrorManager(error.message, error.code);
        }
    }

    async getOneById(id) {
        try {
            const cartFound = await this.#findOneById(id);
            return cartFound;
        } catch (error) {
            throw new ErrorManager(error.message, error.code);
        }
    }

    async insertOne(data) {
        try {
            const productos = data?.products?.map((item) => {
                return { producto: Number(item.producto), quantity: 1 };
            });

            const cart = {
                id: generateId(await this.getAll()),
                productos: productos ?? [],
            };

            this.#carts.push(cart);
            await writeJsonFile(paths.files, this.#jsonFilename, this.#carts);

            return cart;
        } catch (error) {
            throw new ErrorManager(error.message, error.code);
        }
    }
    addOneProduct= async (id, productId, quantity) => {
        try {
            const cartFound = await this.#findOneById(id);
            console.log(cartFound);
            const productIndex = cartFound.productos.findIndex((item) => item.producto === Number(productId));
            console.log(cartFound);
            if (productIndex >= 0) {
                cartFound.productos[productIndex].quantity += quantity ;
            } else {
                cartFound.productos.push({ producto: Number(productId), quantity:1 });
            }

            const index = this.#carts.findIndex((item) => item.id === Number(id));
            this.#carts[index] = cartFound;
            await writeJsonFile(paths.files, this.#jsonFilename, this.#carts);
            return cartFound;
        } catch (error) {
            throw new ErrorManager(error.message, error.code);
        }
    };
}