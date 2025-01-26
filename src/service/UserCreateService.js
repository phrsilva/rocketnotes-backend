
const { hash, compare } = require('bcryptjs');
const AppError = require('../utils/AppError');

class UserCreateService {
    constructor(userRepository){
        this.userRepository = userRepository
    }

    async execute({name, email, password}) {
        
        
        const checkIfUserExists = await this.userRepository.findByEmail(email);

        if(checkIfUserExists){
            throw new AppError('E-mail já cadastrado');
        }

        const passwordHash = await hash(password, 8);

        const userCreated = await this.userRepository.create({ name, email, password: passwordHash });

        return ( userCreated );



    }
}

module.exports = UserCreateService