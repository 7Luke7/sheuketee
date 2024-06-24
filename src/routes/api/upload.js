"use server"
import busboy from "busboy"
import { getRequestEvent } from "solid-js/web";
import {json} from "@solidjs/router"

export async function POST(request) {
    try {
        const event = getRequestEvent()
        const bb = busboy({headers: event.nativeEvent.node.req.headers,  limits: {
            fileSize: 6*1024*1024 //2MB limit
        } })
        bb.on('field', function(fieldname, val, fieldnameTruncated, valTruncated) {
            //extract intput-field from upload-form
        });


        bb.on('file', function(fieldname, file, filename, encoding, mimetype) {
            //process each file upload, check for size, mimetype, 
            //store if all checks passed, delete otherwise, move to 
            //next file
        });


        //finish call back when all files are uploaded
        bb.on('finish', function() {
            //do cleanup and other related work 
        });

        return event.nativeEvent.node.req.pipe(bb);

    } catch(error) {
        console.log(error)
    }
}