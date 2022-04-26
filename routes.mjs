import { resolve } from 'path';

export default function routes(app) {
  app.get('/', (request, response) => {
    response.sendFile(resolve('dist', 'main.html'));
  });
  app.get('/signup', (request, response) => {
    response.sendFile(resolve('dist', 'main.html'));
  });
}
