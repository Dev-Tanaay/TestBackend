"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const data_source_1 = require("./data-source");
const product_routes_1 = __importDefault(require("./routes/product.routes"));
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use('/api/products', product_routes_1.default);
data_source_1.AppDataSource.initialize()
    .then(() => {
    console.log('Connected to DB');
    app.listen(port, () => {
        console.log(`Server running at http://localhost:${port}`);
    });
})
    .catch((error) => console.error('DB connection failed:', error));
//# sourceMappingURL=index.js.map