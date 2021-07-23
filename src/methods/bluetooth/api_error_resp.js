'use strict'

class ApiErrorResp {
    constructor(code, message) {
        this.code = code;
        this.message = message;
    }
} 

module.exports = ApiErrorResp;