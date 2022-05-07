export default function initUserTransactionsModel(sequelize, DataTypes) {
	return sequelize.define(
		'user_transactions',
		{
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: DataTypes.INTEGER,
			},
			userID: {
				type: DataTypes.INTEGER,
				references: {
					model: 'users',
					key: 'id',
				},
			},
			transactionID: {
				type: DataTypes.INTEGER,
				references: {
					model: 'transactions',
					key: 'id',
				},
			},
			created_at: {
				allowNull: false,
				type: Sequelize.DATE,
			},
			updated_at: {
				allowNull: false,
				type: Sequelize.DATE,
			},
		},
		{ underscored: true }
	);
}
