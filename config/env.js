const dotEnv = require('dotenv-safe')

dotEnv.config({
    allowEmptyValues: true,
    example: './.env.example'
});