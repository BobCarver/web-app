// Ensure require('dotenv').config() is run before this module is required
// or in vs code set "envFile": "${workspaceFolder}/.env" in the launch.json

/*
 * the default object contains the defaults
 */

 import nodemailer from 'nodemailer'
 import postres from 'pg'

const defaults = {
    env: 'development',
    server: {
        port: 5123,
        hostName: 'localhost',
    },
    smtp: {
        SMTP_HOST:  'smtp.ethereal.email',
        SMTP_USER:  'lue4qlqm4usoglqx@ethereal.email',
        SMTP_PASSWORD: 'SMDedy5bC5GfJ8re2a',
    },
    db: {
        host:     'localhost',
        // PGHOSTADDR // behaves the same as the hostaddr connection parameter. This can be set instead of or in addition to PGHOST to avoid DNS lookup overhead.
        port:      5432,
        dataBase: 'web-app-dev',
        user:     'user',
        password: 'password'
    }

    PORT:       5123,
    ENV:        'development',
    HOSTNAME: process.env.HOSTNAME,

};

const smtp = {
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: 'lue4qlqm4usoglqx@ethereal.email',
        pass: 'SMDedy5bC5GfJ8re2a'
    }
}

const gmail = {
    service: 'gmail',
    auth: {
           user: 'youremail@address.com',
           pass: 'yourpassword'
       }
   }

const environments = {
    development:    Object.assign(defaults, {

    }, env),

    test:           Object.assign(defaults, {
        ENV: 'test',
        PGDATABASE: 'web-app-test'
    }, env),
    production: env
}

function merge(v)
const uniq = [... new Set(mArray)]
uniq.map( k => merge())


const transporter = nodemailer.createTransport();

module.exports = environments[ process.env.ENV||'development' ]

if (exports.ENV === 'development' || exports.ENV === 'test') {
    console.log(exports)
}

module.exports = { transporter.sendMail, db }

model name , methods