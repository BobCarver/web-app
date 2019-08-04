
// tenant management
module.exports = {

show: async (ctx)  => {
    // show tenants
    ctx.body = await db.query('allTenants')     
},

// suspend tenant
suspend: async (ctx)  => {
    await db.query('update tenants set active = false where id = ${id}', ctx.params)
},

// add tenant
add: async (ctx)  => {
    await db.query('addTenant', [ctx.request.body])
},

// edit tenant
update: async (ctx)  => {
    
    await db.query('update tenants set ($1) = ($2) where id= $3', [ctx.body.keys(), ctx.body.values(), ctx.params.id] )
}}