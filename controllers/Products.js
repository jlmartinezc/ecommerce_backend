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

        let id = await this.#incrementId(products);
        let dateTime = this.#getTimeStamp();

        (products)
        ? products.push({'id': id, 'timestamp': dateTime, ...data})
        : products = [{'id': id, 'timestamp': dateTime, ...data}];

        products = JSON.stringify(products, null, 2);
        
        return await this.productProvider.saveProducts(products)
        .then(() => "El producto fue creado exitosamente")
        .catch(error => "Ocurrio un fallo al crear el producto");        
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

            return await this.productProvider.saveProducts(updatedProduct)
            .then(() => "El producto fue actualizado exitosamente")
            .catch(error => "Ocurrio un fallo al actualizar el producto");

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

            return await this.productProvider.saveProducts(productsFiltered)
            .then(() => "El producto fue eliminado exitosamente")
            .catch(error => "Ocurrio un fallo al eliminar el producto");            
        }
        catch(err){
            return {'Error': err};
        }  
    }

    async #incrementId(products){
        if(!products) return 1;     

        return Math.max(...products.map(product => product.id)) + 1;        
    }

    #validateId(id){
        return (id.trim() !== '' && id !== undefined && id !== null) ? parseInt(id) : '';
    }

    #findProduct(products, id){
        let product = products.find(product => product.id == id)
        return (product) ? product : {error : 'Producto no encontrado'};
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
}

module.exports = Products;