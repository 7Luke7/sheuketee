export class CustomError extends Error {
    constructor(fieldName, code, message) {
        super(message);
        this.fieldName = fieldName,
        this.code = code
    }
}