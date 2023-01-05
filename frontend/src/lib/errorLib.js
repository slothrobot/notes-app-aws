export function onError(error){
    let message = error.toString();

    //The Auth oackage throws errors in a different format, 
    // so here is to check and get the error message
    if(!(error instanceof Error) && error.message) {
        message = error.message;
    }

    alert(message);
}