export class CustomError extends Error {
    constructor(fieldName, message) {
        super(message);
        this.fieldName = fieldName
    }
}