const { Sequelize, Model, DataTypes } = require("sequelize");

const sequelize = new Sequelize("mi_inventario", "root", "Vale0511", {
    host: "localhost",
    dialect: "mysql",
    port: 3306,
});

class Product extends Model {}

Product.init(
    {
        product_id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },        
        product_lote: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        product_name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        price: {
            type: DataTypes.FLOAT(10, 2),
            allowNull: false,
        },
        amount: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        date_in: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        is_stock: {
            type: DataTypes.BOOLEAN,
        },
    },
    {
        sequelize,
        modelName: "Product",
        tableName: "product_test",
        timestamps: false
    }
);

module.exports = Product;

// async function testConnection() {
//     try {
//         await sequelize.authenticate();
//         console.log("All Good!!")
//     } catch (err) {
//         console.error("All Bad!!", err)
//     }
// }

// testConnection();
