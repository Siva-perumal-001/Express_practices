export const userValidatationSchema = {
    user_name: {
        notEmpty: {
            errorMessage: "Username Can't be empty"
        },
        isLength: {
            options: {min:3, max:12},
            errorMessage: "username length requirements are not met"
        }
    },
    age: {
        notEmpty: {
            errorMessage: "age must not be empty"
        }
    }
}