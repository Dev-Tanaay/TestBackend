import { DataSource } from 'typeorm';
import { Product } from './entity/Product';
import { ProductImage } from './entity/ProductImage';
import { config } from 'dotenv';
config()
export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: true,
  logging: true,
  ssl: true,
  extra: {
    ssl: {
      rejectUnauthorized: false,
    },
  },
  entities: [Product, ProductImage], 
});
