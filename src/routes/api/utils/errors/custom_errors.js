export class CustomError extends Error {
    constructor(fieldName, message, code) {
        super(message);
        this.fieldName = fieldName,
        this.code = code
    }
}