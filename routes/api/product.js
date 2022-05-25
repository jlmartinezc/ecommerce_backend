const { Router } = require('express');
const Products = require('../../controllers/Products')
const ProductsService = require('../../models/ProductsService');
const verify = require('../../utils/verifyAdmin');

const router = Router();
const filePath = './data/products.txt';

const dataService = new ProductsService(filePath);
const newProduct = new Products(dataService);

let isAdmin = true;

router.get('/:id?', async(req, res) => res.send( await newProduct.getProducts(req.params.id)));

router.post('/', 
    (req, res, next) => verify.isAdmin(isAdmin, res, next),
    async(req, res) => res.send( await newProduct.createProduct(req.body)) 
);

router.put('/:id', 
    (req, res, next) => verify.isAdmin(isAdmin, res, next),
    async(req, res) => res.send( await newProduct.updateProduct(req.params.id, req.body))
);

router.delete('/:id',  
    (req, res, next) => verify.isAdmin(isAdmin, res, next),
    async(req, res) => res.send( await newProduct.deleteProduct(req.params.id))
);

module.exports = router;