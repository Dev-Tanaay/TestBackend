"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
const typeorm_1 = require("typeorm");
const Product_1 = require("./entity/Product");
const ProductImage_1 = require("./entity/ProductImage");
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
exports.AppDataSource = new typeorm_1.DataSource({
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
    entities: [Product_1.Product, ProductImage_1.ProductImage],
});
//# sourceMappingURL=data-source.js.map