export class Request {
    constructor(method, params) {
        this.method = method;
        this.params = params;
    }

    toJson() {
        let result = {
            method: this.method,
            id: "42"
        }

        if (this.params) {
            result.params = this.params;
        }

        return result;
    }

    toString() {
        return JSON.stringify(this.toJson());
    }
};
