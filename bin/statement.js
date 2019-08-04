const createInvoiceSQL = '';
let templates = {}

const listOfStatements = db.query(createInvoiceSQL);



import sendMail from './config'

async function sendStatements( tenant, listOfStatements ) {
    async function makeTemplate(name){
        import {readFile} from 'fs'
        import {join} from 'path'
        import {compile} from 'handlebars'

        const fileContents = await readFile(join(__dirname, name, type));
        return fileContents ? compile(fileContents) : () => nil 
    }
    const 
        textTemplate = makeTemplate( tenant, 'text'),
        htmlTemplate = makeTemplate( tenant, 'html');

    for( const statement of listOfStatements ) {
        sendMail( {
            from:   tennant.email,
            to:     statement.company.email,
            subject: 'Message title',
            text:   textTemplate(statement),
            html:   htmlTemplate(statement),
            attachments: [{   // utf-8 string as an attachment
                filename: `statement${statement.id}.pdf`,
                content: statement.toPdf()
            }]
        }).catch(err => {
            console.log(`error sending statement ${statement.id} to ${statement.company.email} from ${tenant}`, err)
        })
    }
}

async function resendStatement( id ) {
    const statement = db.query(createInvoiceSQL);


