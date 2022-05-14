export default function initSPYModel(sequelize, DataTypes) {
	return sequelize.define(
		'SPY',
		{
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: DataTypes.INTEGER,
			},
			value: {
				allowNull: false,
				type: DataTypes.INTEGER,
			},
            timestamp:{
                allowNull: false,
				type: DataTypes.INTEGER,
            },
			created_at: {
				allowNull: false,
				type: DataTypes.DATE,
			},
			updated_at: {
				allowNull: false,
				type: DataTypes.DATE,
			},
		},
		{ underscored: true }
	);
}