"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class game_user extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  game_user.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      color: {
        allowNull: false,
        type: DataTypes.ENUM("white", "black"),
      },
      last_move_timestamp: {
        allowNull: false,
        type: DataTypes.DATE, // Timestamp du dernier coup du joueur
        defaultValue: DataTypes.literal("CURRENT_TIMESTAMP"),
      },
      time_remaining: {
        allowNull: false,
        type: DataTypes.INTEGER, // ou un autre type de données approprié
        defaultValue: 1800, // 30 minutes par défaut
      },
      id_game: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "game",
          key: "id",
        },
      },
      id_user: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "user",
          key: "id",
          onDelete: "CASCADE",
          onUpdate: "CASCADE",
        },
      },
    },
    {
      sequelize,
      modelName: "game_user",
    }
  );
  return game_user;
};
