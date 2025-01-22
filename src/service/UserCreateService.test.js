const UserCreateService = require('./UserCreateService');
const UserRepositoryInMemory = require('../repositories/UserRepositoryInMemory');

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
})



