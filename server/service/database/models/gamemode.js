'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class gamemode extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  gamemode.init({
    id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      libelle: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      gamemode: {
        type: DataTypes.INTEGER, 
        allowNull: false, 
        references: {
            model: "gamemode",
            key: "id",
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
        }
      },
  }, {
    sequelize,
    modelName: 'gamemode',
  });
  return gamemode;
};