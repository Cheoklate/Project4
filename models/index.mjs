import { BelongsToMany, Sequelize } from 'sequelize';
import url from 'url';
import allConfig from '../config/config.js';
import initUsersModel from './users.mjs';
import initTransactionModel from './transactions.mjs';
import initUserTransactionsModel from './user_transactions.mjs';
import initNetLiqModel from './netLiq.mjs';
import initSPYModel from './SPY.mjs';
import initXIRRModel from './XIRR.mjs';

const env = process.env.NODE_ENV || 'development';

const config = allConfig[env];

const db = {};

let sequelize;

if (env === 'production') {
	// break apart the Heroku database url and rebuild the configs we need

	const { DATABASE_URL } = process.env;
	const dbUrl = url.parse(DATABASE_URL);
	const username = dbUrl.auth.substr(0, dbUrl.auth.indexOf(':'));
	const password = dbUrl.auth.substr(
		dbUrl.auth.indexOf(':') + 1,
		dbUrl.auth.length
	);
	const dbName = dbUrl.path.slice(1);

	const host = dbUrl.hostname;
	const { port } = dbUrl;

	config.host = host;
	config.port = port;

	sequelize = new Sequelize(dbName, username, password, config);
} else {
	sequelize = new Sequelize(
		config.database,
		config.username,
		config.password,
		config
	);
}

db.User = initUsersModel(sequelize, Sequelize.DataTypes);
db.Transactions = initTransactionModel(sequelize, Sequelize.DataTypes);
// db.UserTransactions  = initUserTransactionsModel(sequelize, Sequelize.DataTypes);
db.SPY = initSPYModel(sequelize, Sequelize.DataTypes);
db.XIRR = initXIRRModel(sequelize, Sequelize.DataTypes);

db.Transactions.belongsToMany(db.User, { through: 'user_transactions' });
db.User.belongsToMany(db.Transactions, { through: 'user_transactions' });

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
