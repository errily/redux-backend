module.exports = app => {
  const inventory = require("../controllers/inventory.controller.js");

    var router =  require("express").Router();

    //create
    router.post("/", inventory.create);

    //retrieve all
    router.get("/",inventory.findAll);

    //retrieve all published 
    router.get("/published", inventory.findAllPublished);
    
    //retrieve all user 
     router.get("/user/:id", inventory.findAllUser);

    //retrieve a single inventory
    router.get("/:id", inventory.findOne);

    //update
    router.put("/:id", inventory.update);

    //delete by id 
    router.delete("/:id", inventory.delete);

      //delete by id 
      router.delete("/user/:id", inventory.deleteUser);

    //delete all
    router.delete("/", inventory.deleteAll);

  app.use('/api/inventory', router);
};