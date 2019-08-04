import Router from 'koa-router'

const router = new Router()

function getQueryString (ctx) {
  const resourceQuery = db.queries[ctx.params.resource]
  ctx.assert(resourceQuery, '404', 'no such resource')

  const queryString = resourceQuery[ctx.method]
  ctx.assert(queryString, '405', 'method not allowed for resource')

  return queryString
}

router
  .put('/job/:id/down', controllers.job.down(ctx))
  .post('/job/:id/pod/', controllers.job.pod(ctx))
  .post('/address', controllers.job.validate(ctx))
  .post('/complete', controllers.job.complete(ctx))
  .post('/rate', controllers.job.rate(ctx))
  // handle resources
  .get('/:resource', async ctx => {
    return await db.query(queryString(ctx), ctx.body)
    // return the template
  })
  .all('/:resource/:id', async ctx => {
    return await db.query(queryString(ctx), ctx.body, ctx.body.params.id)
  })

export default router
