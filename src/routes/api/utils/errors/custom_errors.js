export class CustomError extends Error {
    constructor(name, message) {
        super(message);
        this.name = name
    }
    
    ExntendToErrorName(errorName) {
        return {
            field: this.name,
            message: this.message,
            name: errorName
        }
    }
}