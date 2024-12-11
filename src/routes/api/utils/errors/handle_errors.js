export class HandleError {
    constructor(error) {
        this.error = error
    }

    validation_error() {
        if (!this.error.errors) {
            return [{
                field: this.error.fieldName,
                message: this.error.message
            }]
        }
        const errored_fields = Object.keys(this.error.errors)
        return errored_fields.map((e, i) => ({
            field: e,
            message: this.error.errors[e].message
        }))
    }
    
    authentication_error() {
        
    }

    duplicate_error(target) {
        return `მომხმარებელი ${target} უკვე არსებობს.`
    }
    global_error() {
        return {
            message: "დაფიქსირდა სერვერული შეცდომა."
        }
    }
}