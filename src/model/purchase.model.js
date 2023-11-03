const { Sequelize, Model, DataTypes } = require("sequelize");

const sequelize = new Sequelize("mi_inventario", "root", "Vale0511", {
    host: "localhost",
    dialect: "mysql",
    port: 3306,
});

class Purchase extends Model {}

Purchase.init(
    {
        purchase_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        user_id: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        purchase_date: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        total_amount: {
            type: DataTypes.FLOAT(10, 2),
            allowNull: false,
        },
    },
    {
        sequelize,
        modelName: "Purchase",
        tableName: "Purchases",
        timestamps: false
    }
);

class PurchaseDetail extends Model {}

PurchaseDetail.init(
    {
        purchase_detail_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        purchase_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        product_id: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        quantity: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        unit_price: {
            type: DataTypes.FLOAT(10, 2),
            allowNull: false,
        },
    },
    {
        sequelize,
        modelName: "PurchaseDetail",
        tableName: "PurchaseDetails",
        timestamps: false
    }
);

class Invoice extends Model {}

Invoice.init(
    {
        invoice_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        purchase_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        invoice_number: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        invoice_date: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        total_amount: {
            type: DataTypes.FLOAT(10, 2),
            allowNull: false,
        },
    },
    {
        sequelize,
        modelName: "Invoice",
        tableName: "Invoices",
        timestamps: false
    }
);

class PurchaseHistory extends Model {}

PurchaseHistory.init(
    {
        purchase_history_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        user_id: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        purchase_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    },
    {
        sequelize,
        modelName: "PurchaseHistory",
        tableName: "PurchaseHistory",
        timestamps: false
    }
);

// Definir relaciones entre modelos si es necesario

Purchase.hasMany(PurchaseDetail, { foreignKey: 'purchase_id' });
PurchaseDetail.belongsTo(Purchase, { foreignKey: 'purchase_id' });

Purchase.hasOne(Invoice, { foreignKey: 'purchase_id' });
Invoice.belongsTo(Purchase, { foreignKey: 'purchase_id' });

PurchaseHistory.belongsTo(Purchase, { foreignKey: 'purchase_id' });
Purchase.hasMany(PurchaseHistory, { foreignKey: 'purchase_id' });


module.exports = {
    Purchase,
    PurchaseDetail,
    Invoice,
    PurchaseHistory
};
