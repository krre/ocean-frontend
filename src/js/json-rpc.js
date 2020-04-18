export class Request {
    constructor(method, params) {
        this.method = method;
        this.params = params;
    }

    toJson() {
        let result = {
            method: this.method,
            id: this.getCounter()
        }

        if (this.params) {
            result.params = this.params;
        }

        return result;
    }

    toString() {
        return JSON.stringify(this.toJson());
    }

    getCounter() {
        if (!Request.counter) {
            Request.counter = 1;
        } else {
            Request.counter++;
        }

        return String(Request.counter);
    }
};
