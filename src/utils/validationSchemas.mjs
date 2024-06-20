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
export const CreateBicicletaValidation = {
    quadro_bicicleta: {
        isFloat: {
            errorMessage: "Quadro must be a number",
        },
        notEmpty: {
            errorMessage: "Quadro cannot be empty",
        }
    },
    cor_bicicleta: {
        isString: {
            errorMessage: "Cor must be a string",
        },
        notEmpty: {
            errorMessage: "Cor cannot be empty",
        }
    },
    
}

export const CreateEscolhaValidation = {
    codigo_interessado: {
        isInt: {
            errorMessage: "Codigo escolhido must be a number",
        },
        notEmpty: {
            errorMessage: "Codigo escolhido cannot be empty",
        }
    }
}

export const CreateInteressadoValidation = {
    nome_interessado: {
        isString: {
            errorMessage: "Nome must be a string",
        },
        notEmpty: {
            errorMessage: "Nome cannot be empty",
        }
    },
    email_interessado: {
        isEmail: {
            errorMessage: "Email must be a valid email",
        },
        notEmpty: {
            errorMessage: "Email cannot be empty",
        }
    },
    fone_interessado: {
        isString: {
            errorMessage: "Fone must be a string",
        },
        notEmpty: {
            errorMessage: "Fone cannot be empty",
        }
    },
    altura_interessado_cm: {
        isInt: {
            errorMessage: "Altura must be a number",
        },
        notEmpty: {
            errorMessage: "Altura cannot be empty",
        }
    }
}