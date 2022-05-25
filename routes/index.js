const express = require("express");
const productRouter = require("./api/product");
const cartRouter = require("./api/cart");

const validateRoute = (req, res) => {
  res.status(404);
  
  if (req.accepts('json')) {
    res.send({ error: -2, descripcion: 'Ruta no implementada' });
    return;
  }
}

module.exports = function(app) {
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use("/api/productos", productRouter);
  app.use("/api/carrito", cartRouter);
  app.use((req, res, next) => validateRoute(req, res));
};