//const ApiErrorResp = require('./api_error_resp');
const ApiErrorResp = require("./api_error_resp")

class ApiResponse {
    constructor(data, ok, code, error) {
        this.data = data;
        this.ok = ok;
        if (code && error) { this.errors = [new ApiErrorResp(code, error)]; }
    }

    addData(key, data) {

        if (!key || !data) { return }

        if (!this.data) { this.data = {}; }

        this.data[key] = data;
    }

    addError(code, msg) {

        if (!code && !msg) { return }

        if (!this.errors) {
            this.errors = [];
        }

        this.errors.push(new ApiErrorResp(code, msg))

    }

    setOk(ok) {
        this.ok = ok;
    }
}

module.exports = ApiResponse;