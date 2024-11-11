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
    addOneProduct= async (id, productId) => {
        try {
            const cartFound = await this.#findOneById(id);
            console.log(cartFound);
            const productIndex = cartFound.productos.findIndex((item) => item.product === Number(productId));
            console.log(cartFound);
            if (productIndex >= 0) {
                cartFound.productos[productIndex].quantity++;
            } else {
                cartFound.productos.push({ product: Number(productId), quantity: 1 });
            }

            const index = this.#carts.findIndex((item) => item.id === Number(id));
            this.#carts[index] = cartFound;
            await writeJsonFile(paths.files, this.#jsonFilename, this.#carts);
            return cartFound;
        } catch (error) {
            throw new ErrorManager(error.message, error.code);
        }
    };
    // addOneProduct= async (id, ingredientId) => {
    //     try {
    //         const recipeFound = await this.#findOneById(id);
    //         const ingredientIndex = recipeFound.ingredients.findIndex((item) => item.ingredient === Number(ingredientId));

    //         if (ingredientIndex >= 0) {
    //             recipeFound.ingredients[ingredientIndex].quantity++;
    //         } else {
    //             recipeFound.ingredients.push({ ingredient: Number(ingredientId), quantity: 1 });
    //         }

    //         const index = this.#recipes.findIndex((item) => item.id === Number(id));
    //         this.#recipes[index] = recipeFound;
    //         await writeJsonFile(paths.files, this.#jsonFilename, this.#recipes);

    //         return recipeFound;
    //     } catch (error) {
    //         throw new ErrorManager(error.message, error.code);
    //     }
    // };
}