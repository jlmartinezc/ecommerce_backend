class Products {
    constructor(productProvider) {
        this.productProvider = productProvider;
    }

    async getProducts(id = '') {
        try{
            id = this.#validateId(id);
            let allProducts = await this.productProvider.getProducts();

            if(allProducts == '' || allProducts == undefined && allProducts == null){
                return {'Error': 'No se encontró ningún producto'}
            }

            allProducts = JSON.parse(allProducts);

            if(id) {
                return this.#findProduct(allProducts, id);
            }

            return allProducts;
        }
        catch(err){
            return {'Error': err};
        }  
    }

    async createProduct(data){
        let products = await this.getProducts();  
        products = (products.Error) ? '' : products;

        let newProduct = await this.#incrementId(products, data);
        newProduct = JSON.stringify(newProduct, null, 2);

        await this.productProvider.saveProducts(newProduct);
        return;
    }

    async updateProduct(id, data){
        try{
            id = this.#validateId(id);
            const products = await this.getProducts();  

            if(products.Error){
                return products;
            }

            let updatedProduct = await products.map(product =>
                product.id === id ? {'id': product.id , ...data} : product
            );

            updatedProduct = JSON.stringify(updatedProduct, null, 2);

            await this.productProvider.saveProducts(updatedProduct);

        }
        catch(err){
            return {'Error': err};
        }  
    }

    async deleteProduct(id){
        try{
            id = this.#validateId(id);
            const products = await this.getProducts();      
               
            if(products.Error){
                return products;
            }  

            let productsFiltered = products.filter((product) => product.id != id);
            productsFiltered = JSON.stringify(productsFiltered, null, 2);

            await this.productProvider.saveProducts(productsFiltered);
            return
            
        }
        catch(err){
            return {'Error': err};
        }  
    }

    async #incrementId(products, product){
        if(!products) return [{'id': 1, ...product}]; 

        const id = Math.max(...products.map(product => product.id)) + 1;
        products.push({'id': id, ...product});
        
        return products;        
    }

    #validateId(id){
        return (id.trim() !== '' && id !== undefined && id !== null) ? parseInt(id) : '';
    }

    #findProduct(products, id){
        let product = products.find(product => product.id == id)
        return (product) ? product : {error : 'Producto no encontrado'};
    }
}

module.exports = Products;