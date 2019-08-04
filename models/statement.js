import fs from'fs'
import jsPDF from'jspdf'

// satisify jsPDF for running outside a client
global.window = {document: {createElementNS: () => {return {}} }};
global.navigator = {};
global.btoa = () => {};

const template = [
    ['id' [10,10],{}]
];


function processInvoice(inv){
    const pdf = new jsPDF;
    let currentY = 0;
    const maxLength = 500

    function processXX(obj, template, y){
        for( const [n,x,y,options] of template) {
            pdf.text(job[n], x, y+currentY, options);
        }
    }
    function processJob(job) {
        processXX([job], jobTemplate, y)
        for( const [n,x,y,options] of jobs.template) {
            pdf.text(job[n], x, y+currentY, options);
        }
        for( const stop of job.stops ) {
            let myY = currentY;
            for( const [n,x,y,options] of stops.template) {
                pdf.text(stop[n], x, y+currentY, options);
            }

        }
        for( const charge of job.charges ) {
            let myY = currentY;


        }
        currentY += jobHeight(j);
    }

    function jobHeight(j){
        return pdf.getlineHeight + Math.max(j.stops.length, j.charges.length)
    }

    function wontFit(j) {
        return currentY + jobHeight(j) > maxLength;
    }

    function printheader(){}

    function newPage(){
        pdf.addPage();
    }

    printheader(inv);
    for( const j of inv.jobs) {
        if( wontFit(j)) newPage();
        procesJob(j);
    }
    return pdf.output();
}
