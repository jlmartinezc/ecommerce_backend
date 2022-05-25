class Cart {
    constructor(cartService, productService){
        this.cartService = cartService;
        this.productService = productService;
    }

    async getProductsOnCart(id){
        try{
            let allCarts = await this.cartService.getCart();
            
            if(allCarts == '' || allCarts == undefined && allCarts == null){
                return {'Error': 'No se encontró ningún carrito'}
            }
            
            id = this.validateId(id);
            allCarts = JSON.parse(allCarts);

            const cart = allCarts.find(cart => cart.id == id);
            return cart.productos;
        }
        catch(err){
            return {'Error': err};
        }  
    }

    async createCart(){
        const timeStamp = this.getTimeStamp();
        let allCarts = await this.cartService.getCart();
        
        allCarts = (allCarts == '' || allCarts == undefined && allCarts == null) ? '' : JSON.parse(allCarts);
        
        const id = this.incrementId(allCarts);
        
        let cart = {
            'timeStamp': timeStamp,
            'productos': []
        };

        (allCarts)
        ? allCarts.push({'id': id, ...cart})
        : allCarts = [{'id': id, ...cart}];
        
        allCarts = JSON.stringify(allCarts, null, 2);

        return await this.cartService.saveCart(allCarts)
        .then(() => `Se creo un nuevo carrito con id ${id}`)
        .catch(error => "Ocurrio un fallo al crear el carrito");
    }

    async deleteCart(id){
        try{
            const allCarts = JSON.parse(await this.cartService.getCart()); 
            
            if(allCarts == '' || allCarts == undefined && allCarts == null){
                return {'Error': 'No se encontró ningún carrito'}
            }

            id = this.validateId(id);

            let cartsFiltered = allCarts.filter((cart) => cart.id != id);
            cartsFiltered = JSON.stringify(cartsFiltered, null, 2);

            return await this.cartService.saveCart(cartsFiltered)
            .then(() => `Se elimino el carrito con id ${id}`)
            .catch(error => "Ocurrio un fallo al eliminar el producto");
        }
        catch(err){
            return {'Error': err};
        }  
    }

    async addProductToCart(id, id_prod){
        try{            
            let allCarts = JSON.parse(await this.cartService.getCart());
            if(allCarts == '' || allCarts == undefined && allCarts == null){
                return {'Error': 'No se encontró ningún carrito'}
            }
            
            id = this.validateId(id);
            id_prod = this.validateId(id_prod);

            const producto = await this.getProduct(id_prod);
            if(producto.error){
                return producto
            }
            
            allCarts.map(cart => {
                if(cart.id == id){
                    cart.productos.push({...producto})
                }
            });
            
            allCarts = JSON.stringify(allCarts, null, 2);
            
            return await this.cartService.saveCart(allCarts)
            .then(() => 'Se agrego un nuevo prodcuto al carrito')
            .catch(error => "Ocurrio un fallo al agregar el producto");
            
        }
        catch(err){
            return {'Error': err};
        }  
    }

    async deleteProductInCart(id, id_prod){
        try{
            let allCarts = JSON.parse(await this.cartService.getCart());
            if(allCarts == '' || allCarts == undefined && allCarts == null){
                return {'Error': 'No se encontró ningún carrito'}
            }

            id = this.validateId(id);
            id_prod = this.validateId(id_prod);

            allCarts.map(cart => {
                if(cart.id == id){
                    cart.productos = cart.productos.filter(producto => producto.id != id_prod)
                }
            });
            
            allCarts = JSON.stringify(allCarts, null, 2);

            return await this.cartService.saveCart(allCarts)
            .then(() => 'Se elimino un producto del carrito')
            .catch(error => "Ocurrio un fallo al al eliminar un producto");
        }
        catch(err){
            return {'Error': err};
        }  
    }

    async getProduct(id){
        let allProducts = await this.productService.getProducts();

        if(allProducts == '' || allProducts == undefined && allProducts == null){
            return {'Error': 'No se encontró ningún producto'}
        }

        allProducts = JSON.parse(allProducts);

        let product = allProducts.find(product => product.id == id)
        return (product) ? product : {error : 'Producto no encontrado'};
    }

    validateId(id){
        return (id.trim() !== '' && id !== undefined && id !== null) ? parseInt(id) : '';
    }

    getTimeStamp(){
        const date = new Date();
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();

        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');

        const getDate = [day, month, year].join('/');
        const getTime = [hours, minutes, seconds].join(':');

        const dateTime = `${getDate} ${getTime}`;

        return dateTime;
    }

    incrementId(carts){
        if(!carts) return 1; 
        return Math.max(...carts.map(cart => cart.id)) + 1;   
    }
}

module.exports = Cart;