const {authJwt} = require("../middleware");
const artilce = require("../controllers/inventory.controller.js");
const router =  require("express").Router();

module.exports = app => {
    app.use(function (req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token,Origin,Content-Type,Accept"
        ) ;
 
        next(); 
    });
   

    //create
    app.post("/api/inventory", [authJwt.verifyToken],artilce.create);

    //retrieve all
    app.get("/api/inventory", [authJwt.verifyToken],artilce.findAll);

    //retrieve all published 
    app.get("/api/inventory/published", artilce.findAllPublished);

     //retrieve all inventory user
     app.get("/api/inventory/usercount", artilce.findArticleUser);
    
    //retrieve all user 
    app.get("/api/inventory/user/:id",[authJwt.verifyToken], artilce.findAllUser);

    //retrieve a single inventory
    app.get("/api/inventory/:id",[authJwt.verifyToken], artilce.findOne);

    //update
    app.put("/api/inventory/:id",[authJwt.verifyToken], artilce.update);

    //delete by id 
    app.delete("/api/inventory/:id", [authJwt.verifyToken],artilce.delete);

    //delete by id 
    app.delete("/api/inventory/user/:id", [authJwt.verifyToken],artilce.deleteUser);

    //delete all
    app.delete("/api/inventory/",[authJwt.verifyToken], artilce.deleteAll);

    // app.use('/api/inventory', router);
};