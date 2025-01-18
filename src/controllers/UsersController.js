const database = require('../database/sqlite/index');
const { hash, compare } = require('bcryptjs');
const AppError = require('../utils/AppError');

class UsersController{
    async create(request, response){
        const { name, email, password } = request.body;
        const db = await database();
        const checkIfUserExists = await db.get('SELECT * FROM users WHERE email = (?)', [email]);

        if(checkIfUserExists){
            throw new AppError('E-mail já cadastrado', 400);
        }

        const passwordHash = await hash(password, 8);


        await db.run('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', [name, email, passwordHash]);

        return response.json({ name, email, passwordHash });
 
    }

    async update(request, response){
        // current password é a senha atual. password é a nova senha
        // ajustar essa lógica 
        // user.password faz referencia ao campo de senha na tabela user do banco de dados
        
        const { name, email, novaSenha, senhaAtual } = request.body;
        const id = request.user.id;
        const db = await database();
        const user = await db.get('SELECT * FROM users WHERE id = (?)', [id]);
        // criptografa a senha para armazenar no banco de dados.
        const passwordHash = await hash(novaSenha, 8);

        // verifica se o usuario existe/foi informado
        if(!user){
            throw new AppError('Usuário nao encontrado', 400);
        }
        

        const userWithUpdatedEmail = await db.get('SELECT * FROM users WHERE email = (?)', [email]);

        // verifica se o e-mail informado já existe
        if(userWithUpdatedEmail && userWithUpdatedEmail.id !== user.id){
            throw new AppError('E-mail ja cadastrado', 400);
        }

        // verifica se foi informada uma nova senha, sem que tenha sido informada a senha atual
        if(novaSenha && !senhaAtual){
            throw new AppError('Senha atual nao informada', 400);
        }

        // verifica se a senha atual informada bate com a senha salva no banco de dados
        if(novaSenha && senhaAtual){
            const checkPassword = await compare(senhaAtual, user.password);

            if(!checkPassword){
                throw new AppError('Senha atual nao confere', 400);
            }
        }


        // altera, no banco de dados, o nome, email e senha do usuário.       
        user.name = name ?? user.name
        user.email = email ?? user.email
        user.password = novaSenha ?? user.password

        await db.run('UPDATE users SET name = ?, email = ?, password = ? WHERE id = ?', [name, email, passwordHash, id]);

        return response.json({ name, email, passwordHash });
    }
}


module.exports = UsersController;
