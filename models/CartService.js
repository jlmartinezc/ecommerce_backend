const fs = require('fs');

class CartService {
    constructor(filePath){
        this.filePath = filePath;
    }    

    async getCart(){
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

    async saveCart(products){
        try{
            await fs.promises.writeFile(this.filePath, products);
        }
        catch(err){
            return {'Error': err};
        }  
    }
}

module.exports = CartService;