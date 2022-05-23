const express = require('express');
const app = express();
const PORT = 8080 || process.env.PORT;
 
require("./routes/index")(app);

const server = app.listen(PORT, () =>{
     console.log(`Servidor http escuchado en el puerto ${server.address().port}`)
});
server.on("error", error => console.log(`Eror en el servidor: ${error}`));