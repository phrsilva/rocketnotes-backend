const UserCreateService = require('./UserCreateService');
const UserRepositoryInMemory = require('../repositories/UserRepositoryInMemory');
const AppError = require('../utils/AppError');

describe("UserCreateService", () => {
    it("Usuário deve ser criado", async() => {
        const user = {
            name: "Rauner",
            email: "rauner@raunerlimpezas.com.br",
            password: "123456"
        }
    
        const userRepository = new UserRepositoryInMemory()
    
        const userCreateService = new UserCreateService(userRepository)
        const userCreated = await userCreateService.execute(user)
    
        expect(userCreated).toHaveProperty("id");
    
    })

    it("Usuário não é criado se o e-mail já estiver cadastrado", async() => {
        const user1 = {
            name: "Rauner",
            email: "rauner@raunerlimpezas.com.br",
            password: "123456"
        }

        const user2 = {
            name: "Rauner",
            email: "rauner@raunerlimpezas.com.br",
            password: "123456"
        }
    
        const userRepository = new UserRepositoryInMemory()    
        const userCreateService = new UserCreateService(userRepository)
        await userCreateService.execute(user1)

        
    
        await expect(userCreateService.execute(user2)).rejects.toEqual(new AppError('E-mail já cadastrado'));
    })
})



