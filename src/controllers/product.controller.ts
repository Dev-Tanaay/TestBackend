import { Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import { Product } from '../entity/Product';
import { ProductImage } from '../entity/ProductImage';
import { ProductModel } from '../../models/product.type';

const productRepo = AppDataSource.getRepository(Product);
const imageRepo = AppDataSource.getRepository(ProductImage);

export const getAllProducts = async (_: Request, res: Response) => {
  try {
    const products = await productRepo.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch products', error: err });
  }
};

export const getProductById = async (req: Request, res: Response) => {
  try {
    const product = await productRepo.findOneBy({ id: parseInt(req.params.id) });
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch product', error: err });
  }
};

export const createProduct = async (req: Request, res: Response) => {
  try {
    const { sku, name, price, images }: ProductModel = req.body;

    const product = new Product();
    product.sku = sku;
    product.name = name;
    product.price = price;
    product.images = images.map((url: string) => {
      const image = new ProductImage();
      image.imageUrl = url;
      return image;
    });

    const saved = await productRepo.save(product);
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create product', error: err });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const { sku, name, price, images }: Partial<ProductModel> = req.body;

    const product = await productRepo.findOne({
      where: { id },
      relations: ['images'],
    });

    if (!product) return res.status(404).json({ message: 'Product not found' });

    if (sku) product.sku = sku;
    if (name) product.name = name;
    if (price !== undefined) product.price = price;

    if (images) {
      await imageRepo.delete({ product: { id } });
      product.images = images.map((url: string) => {
        const image = new ProductImage();
        image.imageUrl = url;
        return image;
      });
    }

    const updated = await productRepo.save(product);
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update product', error: err });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const result = await productRepo.delete(parseInt(req.params.id));
    if (result.affected && result.affected > 0) {
      res.json({ success: true });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete product', error: err });
  }
};

export const addImageToProduct = async (req: Request, res: Response) => {
  try {
    const productId = parseInt(req.params.productId);
    const { imageUrl } = req.body;

    const product = await productRepo.findOneBy({ id: productId });
    if (!product) return res.status(404).json({ message: 'Product not found' });

    const image = new ProductImage();
    image.imageUrl = imageUrl;
    image.product = product;

    const saved = await imageRepo.save(image);
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ message: 'Failed to add image', error: err });
  }
};

export const deleteImageById = async (req: Request, res: Response) => {
  try {
    const imageId = parseInt(req.params.imageId);

    const result = await imageRepo.delete(imageId);
    if (result.affected === 0) {
      return res.status(404).json({ message: 'Image not found' });
    }

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete image', error: err });
  }
};
