"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class state extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  state.init(
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      move: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      time_remaining: {
        allowNull: false,
        type: DataTypes.INTEGER, // ou un autre type de données approprié pour stocker le temps restant
        defaultValue: 1800, // 30 minutes par défaut
      },
      id_game: {
        type: DataTypes.INTEGER,
        references: {
          model: "games",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      id_user: {
        type: DataTypes.INTEGER,
        references: {
          model: "user",
          key: "id",
          onDelete: "CASCADE",
          onUpdate: "CASCADE",
        },
      }
    },
    {
      sequelize,
      modelName: "state",
    }
  );
  return state;
};
