import React, { children } from 'react'; 
import {createContext, useContext, useState, useEffect} from 'react';
import api from '../api/axios';

//create context 
const AuthContext = createContext(); 

export const AuthProvider = ({children}) =>{
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    //checking const function 
    const checkAuth = async () => {
        try{
           const res = await api.get("/auth/me");
           setUser(res.data);
           setLoading(false);
        }

        catch(err){
             setUser(null);

        }
        finally{
            setLoading(false);
        }
    };

    useEffect(() =>{
        checkAuth();
    }, []);

    //login routh 
    const login = async (credentials) => {
        await api.post("/auth/login", credentials);
        await checkAuth();
    };
    //logout route 
    const logout = async () => {
        await api.post("/auth/logout");
        setUser(null);
    };
    
    return (
        <AuthContext.Provider value={{user, loading, login, logout}}>
            {children}
        </AuthContext.Provider>     
    )


};

export const useAuth = () => useContext(AuthContext);

