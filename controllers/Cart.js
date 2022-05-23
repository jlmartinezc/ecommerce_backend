class Cart {
    constructor(cartService){
        this.cartService = cartService;
    }

    async getProductsOnCart(id){
        try{
            let allCarts = await this.cartService.getCart();
            
            if(allCarts == '' || allCarts == undefined && allCarts == null){
                return {'Error': 'No se encontró ningún carrito'}
            }
            
            id = this.#validateId(id);
            allCarts = JSON.parse(allCarts);

            const cart = allCarts.find(cart => cart.id == id);
            return cart.productos;
        }
        catch(err){
            return {'Error': err};
        }  
    }

    async createCart(){
        const timeStamp = this.#getTimeStamp();
        let allCarts = JSON.parse(await this.cartService.getCart());

        allCarts = (allCarts == '' || allCarts == undefined && allCarts == null) ? '' : allCarts;

        let cart = {
            'timeStamp': timeStamp,
            'productos': {}
        };

        const id = this.#incrementId(allCarts, cart);
        allCarts.push({'id': id, ...cart});
        allCarts = JSON.stringify(allCarts, null, 2);

        await this.cartService.saveCart(allCarts);

        return `Se creo un nuevo carrito con id ${id}`;
    }

    async deleteCart(id){
        try{
            const allCarts = JSON.parse(await this.cartService.getCart()); 
            
            if(allCarts == '' || allCarts == undefined && allCarts == null){
                return {'Error': 'No se encontró ningún carrito'}
            }

            id = this.#validateId(id);

            let cartsFiltered = allCarts.filter((cart) => cart.id != id);
            cartsFiltered = JSON.stringify(cartsFiltered, null, 2);

            await this.cartService.saveCart(cartsFiltered);
            return
            
        }
        catch(err){
            return {'Error': err};
        }  
    }

    async addProductToCart(id, producto){
        try{            
            let allCarts = JSON.parse(await this.cartService.getCart());
            if(allCarts == '' || allCarts == undefined && allCarts == null){
                return {'Error': 'No se encontró ningún carrito'}
            }

            id = this.#validateId(id);

            allCarts.map(cart => {
                if(cart.id == id){
                    cart.productos.push({'id': this.#incrementId(cart.productos), ...producto}) 
                }
            });
            
            allCarts = JSON.stringify(allCarts, null, 2);
            await this.cartService.saveCart(allCarts);
            return;
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

            id = this.#validateId(id);
            id_prod = this.#validateId(id_prod);

            allCarts.map(cart => {
                if(cart.id == id){
                    cart.productos = cart.productos.filter(producto => producto.id != id_prod)
                }
            });
            
            allCarts = JSON.stringify(allCarts, null, 2);
            await this.cartService.saveCart(allCarts);
            return;
        }
        catch(err){
            return {'Error': err};
        }  
    }

    #validateId(id){
        return (id.trim() !== '' && id !== undefined && id !== null) ? parseInt(id) : '';
    }

    #getTimeStamp(){
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

    #incrementId(products){
        if(!products) return 1; 
               
        return Math.max(...products.map(product => product.id)) + 1;   
    }
}

module.exports = Cart;