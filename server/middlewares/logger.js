async function logger(ctx, next) {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log('%s [%s] - %s ms', ctx.name, ctx.type, ms);
}

module.exports = logger
