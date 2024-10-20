class ExrpressError extends Error{
    constructor(statusCode, messagge){
        super();
        this.statusCode = statusCode;
        this.message = messagge;
    }
}
module.exports = ExrpressError;