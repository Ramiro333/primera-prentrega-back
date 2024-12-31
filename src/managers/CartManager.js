import ErrorManager from "./ErrorManager.js";
import { isValidID } from "../config/mongoose.config.js";
import CartModel from "../models/cart.model.js";

export default class CartManager {
    #cartModel;

    constructor() {
        this.#cartModel = CartModel;
    }
    async #findOneById(id) {
        if (!isValidID(id)) {
            throw new ErrorManager("ID inválido", 400);
        }
        const cart = await this.#cartModel.findById(id).populate("products.product");
        if (!cart) {
            throw new ErrorManager("ID no encontrado", 404);
        }
        return cart;
    }

    // async getAll(params) {
    //     try {
    //         const paginationOptions = {
    //             limit: params?.limit || 10,
    //             page: params?.page || 10,
    //             populate: "products.product",
    //             lean: true,
    //         };

    //         return await this.#cartModel.paginate({}, paginationOptions);
    //     } catch (error) {
    //         throw ErrorManager.handleError(error);
    //     }
    // }
    async getAllWithFilters(params) {
        try {
            const { limit = 10, page = 1, sort, query } = params;
            const filter = query ? { "products.product.category": query } : {};
            const paginationOptions = {
                limit: parseInt(limit),
                page: parseInt(page),
                sort: sort ? { "products.product.price": sort === "asc" ? 1 : -1 } : undefined,
                populate: "products.product",
                lean: true,
            };

            const result = await this.#cartModel.paginate(filter, paginationOptions);

            return result;
        } catch (error) {
            throw ErrorManager.handleError(error);
        }
    }

    async getOneById(id) {
        try {
            return await this.#findOneById(id);
        } catch (error) {
            throw ErrorManager.handleError(error);
        }
    }

    async insertOne(data) {
        try {
            const cart = await this.#cartModel.create(data);
            return cart;
        } catch (error) {
            throw ErrorManager.handleError(error);
        }
    }
    addOneProduct= async (id, productId) => {
        try {
            const cart = await this.#findOneById(id);
            const cartIndex = cart.products.findIndex((item) => item.product._id.toString() === productId);

            if (cartIndex >= 0) {
                cart.products[cartIndex].quantity++;
            } else {
                cart.products.push({ product: productId, quantity: 1 });
            }

            await cart.save();

            return cart;
        } catch (error) {
            throw new ErrorManager(error.message, error.code);
        }
    };
    async deleteAll (id) {
        try {
            const cart = await this.#findOneById(id);
            cart.products = [];
            cart.save();
            return cart;
        } catch (error) {
            throw ErrorManager.handleError(error);
        }
    }
    async removeOneProductFromCart(cartId, productId) {
        try{
            const cart = await this.#findOneById(cartId);
            const productIndex = cart.products.findIndex((item) => item.product._id.toString() === productId);
            if(productIndex === -1){
                throw new ErrorManager(`Producto ${productId} no encontrado en el carrito`, 404);
            }
            cart.products.splice(productIndex, 1);
            await cart.save();
            return cart;
        } catch (error) {
            throw new ErrorManager(error.message, error.code || 500);
        }
    }
}