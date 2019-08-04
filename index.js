import { PORT } from './config'

import Koa from 'koa'
const app = new Koa();

import routes  from './routes'
import koaBody from 'koa-bodyparser'

app.use(koaBody({
  jsonLimit: '1kb'
}));

app.use(async (ctx, next) => {
    try {
      await next();
    } catch (err) {
      ctx.status = err.status || 500;
      ctx.body = err.message;
      ctx.app.emit('error', err, ctx);
    }
  });
  
  app.on('error', (err, ctx) => {
    /* centralized error handling:
     *   console.log error
     *   write error to log file
     *   save error and request information to database if ctx.request match condition
     *   ...
    */
  });

app.use(routes.routes());

const server = app.listen(PORT, () => {
  console.log(`Server listening on port: ${PORT}`);
});

export default server;