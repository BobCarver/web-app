module.exports = {
list: async (ctx) => {
    const s = await db.query('allStatements')
    ctx.res.render('statements', {statement: s})     
},

get: async (ctx) => {
    ctx.body = 'not implemented'
} // pdf and xml
}
