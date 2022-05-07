export default function initTransactionModel(sequelize, DataTypes) {
    return sequelize.define('transaction', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      type: {
        type: DataTypes.STRING,
      },
      value: {
        type: DataTypes.INTEGER,
      },
      timestamp: {
        type: DataTypes.STRING,
      },
      created_at: {
        allowNull: false,
        type: DataTypes.DATE,
      },
      updated_at: {
        allowNull: false,
        type: DataTypes.DATE,
      },
    }, { underscored: true });
  }
  