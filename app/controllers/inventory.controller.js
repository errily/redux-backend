const db = require("../models");
const inventory =db.inventorys;
const User = db.user;
const Op = db.Sequelize.Op;
const sequelize = db.sequelize;

//create and save
exports.create = (req, res) => {
    // validate request
    if (!req.body.title) {
        res.status(400).send({
            status : false,
            message : "Cannot be empty !"
        });

        return;
    }

    //create object field
    const inventory = {
        title :  req.body.title,
        description : req.body.description,
	    qty: req.body.qty,
        published: req.body.published ? req.body.published : false,
        userId : req.body.userId
    };

    //save
    inventory.create(inventory)
    .then(
        data => {

            res.send(data);
        })
    .catch(err => {
            res.status(500).send({
                status: false,
                message : err.message || "something error while creating data"
        });
    });

};


// retrieve all 
exports.findAll = (req, res) => {
    const title =  req.query.title;
    var condition = title ? {title : {[Op.like] : `%${title}%`}} :  null;

    inventory.findAll({where : condition})
    .then( data => {
        res.send(data);
    })
    .catch( err => {
        res.status(500).send({
            status : false,
            message : err.message || "something error while retrieving data"
        });
    });
};



//find a single
exports.findOne =  (req, res) => {
    const id = req.params.id;

    inventory.findByPk(id)
    .then(data => {
        res.send(data);
        })
    .catch(err => {
        res.status(500).send({
            status:false,
            message : err.message || "something error while retrieving data with id = "+id
        });
    });

};

//update data
exports.update =  (req, res) => {
    const id = req.params.id;

    inventory.update(req.body,{
        where : {id : id}
    })
    .then(num => {
        if (num == 1) {
            res.send({
                status : true,
                message : "inventory was updated successfully !"
            });
        } else {
            res.send({
                status : false,
                message : `Cannot update inventory with id= ${id}. 
                Maybe inventory was not found or request is empty.
                `
            });
        }
    })
    .catch(err => {
        res.status(500).send({
            status : false,
            message : `Error updating inventory with id = ${id}`
        });
    })
};

// delete single 
exports.delete = (req, res) => {
    const id = req.params.id;

    inventory.destroy({
        where : {id : id}
    })
    .then(num => {
        if (num == 1) {
            res.send({
                status : true,
                message : "inventory was deleted successfully !"
            });
        } else {
            res.send({
                status : false,
                message : `Cannot delete inventory with id= ${id}. 
                Maybe inventory was not found or request is empty.
                `
            });
        }
    })
    .catch(err => {
        res.status(500).send({
            status : false,
            message : `Error deleting inventory with id = ${id}`
        });
    })
};

// delete single 
exports.deleteUser = (req, res) => {
    const id = req.params.id;

    inventory.destroy({
        where : {userId : id}
    })
    .then(num => {
        if (num == 1) {
            res.send({
                status : true,
                message : "inventorys  was deleted successfully !"
            });
        } else {
            res.send({
                status : false,
                message : `Cannot delete inventory with id= ${id}. 
                Maybe inventory was not found or request is empty.
                `
            });
        }
    })
    .catch(err => {
        res.status(500).send({
            status : false,
            message : `Error deleting inventory with id = ${id}`
        });
    })
};

// delete all 
exports.deleteAll =  (req, res) => {
    inventory.destroy({
        where : {},
        truncate : false
    })
    .then(nums => {
        res.send({
            status : true,
            message : `${nums} inventorys were deleted successfully`
        });

    })
    .catch(err => {
        res.status(500).send({
            status :false,
            message : err.message || `Some error occured while removing all inventoryss`
        });
    });
};

//find all published
exports.findAllPublished = (req, res) => {
    User.hasMany(inventory, {foreignKey: 'id'})
    inventory.belongsTo(User, {foreignKey: 'userId'})
    inventory.findAll({where : {published :  true}, include: [{ model: User, attributes: ['username'] }]},{raw: true})
    .then( data => {
        const dat = data.map(dt => {
            //tidy up the user data
            return Object.assign(
              {},
              {
                id: dt.id,
                title: dt.title,
                description: dt.description,
		        qty:dt.qty,
                username :  dt.user.username,
                createdAt : new Intl.DateTimeFormat("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "2-digit",
                    hour: 'numeric', minute: 'numeric', second: 'numeric', 
                    timeZone: 'Asia/Jakarta',
                   
                    
                  }).format(dt.createdAt),
                updatedAt : new Intl.DateTimeFormat("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "2-digit",
                    hour: 'numeric', minute: 'numeric', second: 'numeric', 
                    timeZone: 'Asia/Jakarta',
                   
                  }).format(dt.updatedAt),
                published : dt.published
              });
            });
        res.send(dat);
    })
    .catch( err => {
        res.status(500).send({
            message :  err.message ||  `Some error occured while removing all inventorys`
        });
    });
};

//find all by user
exports.findAllUser = (req, res) => {
    const userId = req.params.id;
    inventory.findAll({where : {userId :  userId}})
    .then( data => {
        res.send(data);
    })
    .catch( err => {
        res.status(500).send({
            message :  err.message ||  `Some error occured while removing all inventorys`
        });
    });
};



//find all published
exports.findinventoryUser = (req, res) => {
    User.hasMany(inventory, {foreignKey: 'id'})
    inventory.belongsTo(User, {foreignKey: 'userId'})
    inventory.findAll({attributes: ['title', sequelize.fn('COUNT', sequelize.col('userId'))], include: [{ model: User, attributes: ['username'] }], 
    group: ['userId','title','description','qty']},{raw: true})
    .then( data => {
        const dat = data.map(dt => {
            //tidy up the user data
            return Object.assign(
              {},
              {
                id: dt.id,
                title: dt.title,
                description: dt.description,
                qty:dt.qty,
                username :  dt.user.username,
                createdAt : new Intl.DateTimeFormat("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "2-digit",
                    hour: 'numeric', minute: 'numeric', second: 'numeric', 
                    timeZone: 'Asia/Jakarta',
                   
                    
                  }).format(dt.createdAt),
                updatedAt : new Intl.DateTimeFormat("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "2-digit",
                    hour: 'numeric', minute: 'numeric', second: 'numeric', 
                    timeZone: 'Asia/Jakarta',
                   
                  }).format(dt.updatedAt),
                published : dt.published
              });
            });
        res.send(data);
    })
    .catch( err => {
        res.status(500).send({
            message :  err.message ||  `Some error occured while removing all inventorys`
        });
    });
};