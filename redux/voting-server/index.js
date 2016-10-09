import makeStore from './src/store';
import startServer from './server';
export const store = makeStore();

startServer();