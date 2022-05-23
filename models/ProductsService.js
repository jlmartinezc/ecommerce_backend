const fs = require('fs');

class ProductsService {
    constructor(filePath){
        this.filePath = filePath;
    }    

    async getProducts(){
        try{
            const fileExist = await fs.existsSync(this.filePath);

            if(fileExist) {
                return await fs.promises.readFile(this.filePath, 'utf-8');
            }
        }
        catch(err){
            return {'Error': err};
        }  
    }

    async saveProducts(products){
        try{
            await fs.promises.writeFile(this.filePath, products);
        }
        catch(err){
            return {'Error': err};
        }  
    }
}

module.exports = ProductsService;