import { Injectable, NotFoundException } from '@nestjs/common';
import { Product } from './product.model';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel('Product') private readonly productModel: Model<Product>,
  ) {}

  async insertProduct(title: string, description: string, price: number) {
    const newProduct = new this.productModel({ title, description, price });
    const result = await newProduct.save();
    console.log(result);

    return result.id as string;
  }

  async getAllProducts() {
    const result = await this.productModel.find().exec();
    return result.map((prod) => ({
      id: prod.id,
      title: prod.title,
      description: prod.description,
      price: prod.price,
    })) as Product[];
  }

  async getSingleProduct(productId: string) {
    const result = await this.productModel.findById(productId).exec();
    return {
      id: result.id,
      title: result.title,
      description: result.description,
      price: result.price,
    } as Product;
  }

  async updateProduct(
    productId: string,
    title: string,
    desc: string,
    price: number,
  ) {
    const updatedProduct = await this.findProduct(productId);
    if (title) {
      updatedProduct.title = title;
    }
    if (desc) {
      updatedProduct.description = desc;
    }
    if (price) {
      updatedProduct.price = price;
    }
    updatedProduct.save();
  }

  async deleteProduct(prodId: string) {
    const result = await this.productModel.deleteOne({ _id: prodId }).exec();
    console.log(result);

    if (result.deletedCount === 0) {
      throw new NotFoundException(' not found');
    }
  }

  private async findProduct(id: string): Promise<Product> {
    let product;
    try {
      product = await this.productModel.findById(id).exec();
    } catch (error) {
      throw new NotFoundException(' not found');
    }

    if (!product) {
      throw new NotFoundException(' not found');
    }
    return product;
  }
}
