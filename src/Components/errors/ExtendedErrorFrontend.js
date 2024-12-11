export class CustomError extends Error {
    constructor(status, message) {
        super(message);
        this.status = status
    }
    
    ExntendToErrorName() {
        return {
            status: this.status,
            message: this.message,
        }
    }
}