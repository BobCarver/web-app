module.exports = {
pod: async (ctx)  => {
    const file = req.files.file;
    const reader = fs.createReadStream(file.path);
    const stream = fs.createWriteStream(path.join('/pod/', file.name));
    reader.pipe(stream);
    console.log('uploading %s -> %s', file.name, stream.path);

    // upload pod
},

charges: async (ctx)  => {
    db.query('insertCharges', [ctx.request.body]);
},

down: async (ctx)  => {
    db.query('stopsDown', [ctx.request.body] )
},

validate: 
async (ctx) => {

},
// address completion
complete:
async (ctx) => {
    
},

// rate job
rate:
    async (ctx) => {
    }
}