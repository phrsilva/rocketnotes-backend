
const { hash, compare } = require('bcryptjs');
const AppError = require('../utils/AppError');

class UserCreateService {
    constructor(userRepository){
        this.userRepository = userRepository
    }

    async execute({name, email, password}) {
        
        
        const checkIfUserExists = await this.userRepository.findByEmail(email);

        if(checkIfUserExists){
            throw new AppError('E-mail já cadastrado', 400);
        }

        const passwordHash = await hash(password, 8);

        await this.userRepository.create({ name, email, password: passwordHash });

        return ( name, email, passwordHash );



    }
}

module.exports = UserCreateService