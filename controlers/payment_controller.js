module.exports = {
get:    
    async (ctx) => {
        ctx.body = await db.query('select * from payments where id = ${id}', ctx.params)     
    },

add: 
    async (ctx) => {
        ctx.body = await db.query('', ctx.params)     

    }
}