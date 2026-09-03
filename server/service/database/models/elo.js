"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class elo extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  elo.init(
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      elo: {
        allowNull: false,
        type: DataTypes.INTEGER,
        defaultValue: 1000,
      },
      id_user: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "user",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      id_game: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "game",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      }
    },
    {
      sequelize,
      modelName: "elo",
    }
  );
  return elo;
};
