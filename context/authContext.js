import { createContext, useContext, useEffect, useState } from "react";


export const AuthContext = createContext();

export const AuthContextProvider = ({children}) => {
    const [user, setUser] = useState(null);
    const [isAuth, setIsAuth] = useState(undefined);

    useEffect(() => {
      setTimeout(() => {
        setIsAuth(false);
      }, 3000)
    }, [])

    const login = async (email, password) => {
        try{

        } catch(error){

        }
    }

    const logout = async (email, password) => {
        try{

        } catch(error){

        }
    }
    
    const register = async (email, password) => {
        try{

        } catch(error){

        }
    }

    return (
        <AuthContext.Provider value = {{user, isAuth, login, register, logout}}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const value = useContext(AuthContext);

    if(!value){
        throw new Error('Error provider')
    }
    return value;
}