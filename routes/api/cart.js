const { Router } = require('express');
const Cart = require('../../controllers/Cart')
const CartService = require('../../models/CartService');
const ProductsService = require('../../models/ProductsService');

const router = Router();
const filePath = './data/cart.txt';
const productPath = './data/products.txt';

const dataService = new CartService(filePath);
const productService = new ProductsService(productPath);
const newCart = new Cart(dataService, productService);

router.post('/', async(req, res) => res.send( await newCart.createCart() ));
router.delete('/:id', async(req, res) => res.send( await newCart.deleteCart(req.params.id) ));
router.get('/:id/productos', async(req, res) => res.send( await newCart.getProductsOnCart(req.params.id) ));
router.post('/:id/productos/:id_prod', async(req, res) => res.send( await newCart.addProductToCart(req.params.id, req.params.id_prod) ));
router.delete('/:id/productos/:id_prod', async(req, res) => res.send( await newCart.deleteProductInCart(req.params.id, req.params.id_prod) ));

module.exports = router;
