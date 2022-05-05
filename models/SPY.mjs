export default function SPYModel(sequelize, DataTypes) {
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
			createdAt: {
				allowNull: false,
				type: DataTypes.DATE,
			},
			updatedAt: {
				allowNull: false,
				type: DataTypes.DATE,
			},
		},
		{ underscored: true }
	);
}