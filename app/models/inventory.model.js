module.exports = (sequelize, Sequelize) => {
    const inventory = sequelize.define("inventorys",{
        title : {
            type: Sequelize.STRING
        },
        description: {
            type: Sequelize.STRING
        },
        qty: {
            type: Sequelize.STRING
        },
        published: {
            type: Sequelize.BOOLEAN
        },
      
    });

    return inventory;
};