import * as debug from './debug';

export default function handler(lambda) {
    return async function (event, context) {
        let body, statusCode;

        //start debugger
        debug.init(event);

        try {
            //Run lambda
            body = await lambda(event, context);
            statusCode = 200;
        } catch (e) {
            //Prints debug messages
            debug.flush(e);
            
            body = { error: e.message };
            statusCode = 500;
        }
        //Return HTTP response
        return {
            statusCode,
            body: JSON.stringify(body),
            //Configure the CORS headers
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Credentials": true,
              },
        };
    };
}