const { Sequelize, Model, DataTypes } = require("sequelize");

const sequelize = new Sequelize("mi_inventario", "root", "Vale0511", {
    host: "localhost",
    dialect: "mysql",
    port: 3306,
});

class User extends Model {}

User.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        sequelize,
        modelName: "User",
        tableName: "users",
        timestamps: false
    }
);

class Role extends Model {}

Role.init(
    {
        role_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
        },        
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        sequelize,
        modelName: "Role",
        tableName: "roles",
        timestamps: false
    }
);

// loginLog.model.js
class LoginLog extends Model {}

LoginLog.init(
    {
        log_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
        },
        user_id: {
            type: DataTypes.STRING, // Cambio a STRING
            allowNull: true,
        },
        email: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        login_time: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
            allowNull: true,
        },
        login_status: {
            type: DataTypes.ENUM('success', 'failure'),
            allowNull: true,
        },
        ip_address: {
            type: DataTypes.STRING(45),
            allowNull: true,
        },
    },
    {
        sequelize,
        modelName: "LoginLog",
        tableName: "loginlogs",
        timestamps: false,
    }
);


// Definir la relación entre User y Role
User.belongsTo(Role, { foreignKey: 'role_id' });

module.exports = { User, Role, LoginLog };
