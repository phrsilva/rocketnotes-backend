import {createContext, useContext, useState, useEffect} from 'react';
import { api } from '../service/API';

export const AuthContext = createContext({});

function AuthProvider({children}) {
    
    const [data, setData] = useState({});
    async function signIn({email, password}) {

        try {
        const response = await api.post('/sessions', {email, password});
        const {token, user} = response.data;

        localStorage.setItem('@rocketnotes:user', JSON.stringify(user))
        localStorage.setItem('@rocketnotes:token', token)

        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        setData({user, token});

        } catch (error) {
            if (error.response) {
                alert(error.response.data.message)
            } else {
                alert("Não foi possível entrar.")
            }
        }



    }

    useEffect(() => {
        const user = localStorage.getItem('@rocketnotes:user');
        const token = localStorage.getItem('@rocketnotes:token');

        if (user && token) {
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

            setData({
                user: JSON.parse(user),
                token
            });
        }
    }, []);
    
    function signOut() {
        localStorage.removeItem('@rocketnotes:user');
        localStorage.removeItem('@rocketnotes:token');
        setData({});
    }

    async function updateProfile({user, avatarFile}) {
        try {
            
            if (avatarFile) {
                const fileUploadForm = new FormData();
                fileUploadForm.append('avatar', avatarFile);
                
                const response = await api.patch('/users/avatar', fileUploadForm)
                user.avatar = response.data.avatar
            }
            
            await api.put('/users', user)
            localStorage.setItem('@rocketnotes:user', JSON.stringify(user))

            setData({
                user,
                token: data.token
            })

            alert('Perfil atualizado!')
        } catch (error) {
            alert('Não foi possível atualizar o perfil');
        }
    }


    return(
        <AuthContext.Provider value={{
            signIn, 
            user: data.user, 
            signOut,
            updateProfile
            }}>
            {children}
        </AuthContext.Provider>
    )
}

function useAuth() {
    const context = useContext(AuthContext);

    return context;
}


export {AuthProvider, useAuth};

