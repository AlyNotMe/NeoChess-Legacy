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
  }, {
    sequelize,
    modelName: 'gamemode',
    tableName: 'gamemode',
    timestamps: false,
  });
  return gamemode;
};