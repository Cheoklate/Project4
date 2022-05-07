module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.createTable(
			'users',
			{
				id: {
					allowNull: false,
					autoIncrement: true,
					primaryKey: true,
					type: Sequelize.INTEGER,
				},
				email: {
					type: Sequelize.STRING,
				},
				password: {
					type: Sequelize.STRING,
				},
				admin: {
					type: Sequelize.BOOLEAN,
				},
				firstName: {
					type: Sequelize.STRING,
				},
				lastName: {
					type: Sequelize.STRING,
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

		await queryInterface.createTable(
			'transactions',
			{
				id: {
					allowNull: false,
					autoIncrement: true,
					primaryKey: true,
					type: Sequelize.INTEGER,
				},
				type: {
					type: Sequelize.STRING,
				},
				value: {
					type: Sequelize.INTEGER,
				},
				timestamp: {
					type: Sequelize.STRING,
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

		await queryInterface.createTable(
			'SPY',
			{
				id: {
					allowNull: false,
					autoIncrement: true,
					primaryKey: true,
					type: Sequelize.INTEGER,
				},
				value: {
					allowNull: false,
					type: Sequelize.INTEGER,
				},
				timestamp: {
					allowNull: false,
					type: Sequelize.INTEGER,
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

		await queryInterface.createTable(
			'XIRR',
			{
				id: {
					allowNull: false,
					autoIncrement: true,
					primaryKey: true,
					type: Sequelize.INTEGER,
				},
				value: {
					allowNull: false,
					type: Sequelize.INTEGER,
				},
				timestamp: {
					allowNull: false,
					type: Sequelize.INTEGER,
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

		await queryInterface.createTable(
			'netLiq',
			{
				id: {
					allowNull: false,
					autoIncrement: true,
					primaryKey: true,
					type: Sequelize.INTEGER,
				},
				value: {
					allowNull: false,
					type: Sequelize.INTEGER,
				},
				timestamp: {
					allowNull: false,
					type: Sequelize.INTEGER,
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
		await queryInterface.createTable(
			'user_transactions',
			{
				id: {
					allowNull: false,
					autoIncrement: true,
					primaryKey: true,
					type: Sequelize.INTEGER,
				},
				userID: {
					type: Sequelize.INTEGER,
					references: {
						model: 'users',
						key: 'id',
					},
				},
				transactionID: {
					type: Sequelize.INTEGER,
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
	},

	down: async (queryInterface, Sequelize) => {
		await queryInterface.dropTable('user_transactions');

    await queryInterface.dropTable('XIRR');
		await queryInterface.dropTable('SPY');
		await queryInterface.dropTable('netLiq');

		await queryInterface.dropTable('users');
		await queryInterface.dropTable('transactions');
	},
};
