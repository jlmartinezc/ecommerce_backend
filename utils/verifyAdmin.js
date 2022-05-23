module.exports = {
    isAdmin: (rol, res, next) =>{
        (rol) 
            ? next()
            : res.status(401).json({ error: -1, descripcion: "ruta no autorizada" });
    }
}