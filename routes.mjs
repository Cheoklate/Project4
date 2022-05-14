import db from './models/index.mjs';
import { resolve } from 'path';
import initUserController from './controllers/users.mjs';

export default function routes(app) {
	const UserController = initUserController(db);

	app.get('/', (request, response) => {
		response.sendFile(resolve('dist', 'main.html'));
	});
	app.get('/signup', (request, response) => {
		response.sendFile(resolve('dist', 'main.html'));
	});
	app.get('/signin', (request, response) => {
		response.sendFile(resolve('dist', 'main.html'));
	});
	app.get('/dashboard', (request, response) => {
		response.sendFile(resolve('dist', 'main.html'));
	});

	app.post('/login', UserController.login);
}
