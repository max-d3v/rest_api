//Validation schemas using express-validator
export const exampleRouteValidation = {
    example: {
        isString: {
            errorMessage: "Example must be a string",
        },
        notEmpty: {
            errorMessage: "Example cannot be empty",
        }
    }
} 
// ----------------------------