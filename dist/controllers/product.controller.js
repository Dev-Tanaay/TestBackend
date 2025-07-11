"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProduct = exports.updateProduct = exports.createProduct = exports.getProductById = exports.getAllProducts = void 0;
const data_source_1 = require("../data-source");
const Product_1 = require("../entity/Product");
const ProductImage_1 = require("../entity/ProductImage");
const productRepo = data_source_1.AppDataSource.getRepository(Product_1.Product);
const imageRepo = data_source_1.AppDataSource.getRepository(ProductImage_1.ProductImage);
const getAllProducts = async (_, res) => {
    try {
        const products = await productRepo.find();
        res.json(products);
    }
    catch (err) {
        res.status(500).json({ message: 'Failed to fetch products', error: err });
    }
};
exports.getAllProducts = getAllProducts;
const getProductById = async (req, res) => {
    try {
        const product = await productRepo.findOneBy({ id: parseInt(req.params.id) });
        if (!product)
            return res.status(404).json({ message: 'Product not found' });
        res.json(product);
    }
    catch (err) {
        res.status(500).json({ message: 'Failed to fetch product', error: err });
    }
};
exports.getProductById = getProductById;
const createProduct = async (req, res) => {
    try {
        const { sku, name, price, images } = req.body;
        const product = new Product_1.Product();
        product.sku = sku;
        product.name = name;
        product.price = price;
        product.images = images.map((url) => {
            const image = new ProductImage_1.ProductImage();
            image.imageUrl = url;
            return image;
        });
        const saved = await productRepo.save(product);
        res.status(201).json(saved);
    }
    catch (err) {
        res.status(500).json({ message: 'Failed to create product', error: err });
    }
};
exports.createProduct = createProduct;
const updateProduct = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const { sku, name, price, images } = req.body;
        const product = await productRepo.findOne({
            where: { id },
            relations: ['images'],
        });
        if (!product)
            return res.status(404).json({ message: 'Product not found' });
        if (sku)
            product.sku = sku;
        if (name)
            product.name = name;
        if (price !== undefined)
            product.price = price;
        if (images) {
            await imageRepo.delete({ product: { id } });
            product.images = images.map((url) => {
                const image = new ProductImage_1.ProductImage();
                image.imageUrl = url;
                return image;
            });
        }
        const updated = await productRepo.save(product);
        res.json(updated);
    }
    catch (err) {
        res.status(500).json({ message: 'Failed to update product', error: err });
    }
};
exports.updateProduct = updateProduct;
const deleteProduct = async (req, res) => {
    try {
        const result = await productRepo.delete(parseInt(req.params.id));
        if (result.affected && result.affected > 0) {
            res.json({ success: true });
        }
        else {
            res.status(404).json({ message: 'Product not found' });
        }
    }
    catch (err) {
        res.status(500).json({ message: 'Failed to delete product', error: err });
    }
};
exports.deleteProduct = deleteProduct;
//# sourceMappingURL=product.controller.js.map