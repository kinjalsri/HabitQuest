/*Read user and loading from useAuth()
If loading → return null (or loader)
If no user → redirect to /login
If user exists → render children*/

import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({children}) => {
    const {user, loading} = useAuth();
    
     if(loading){
        return null;
     } 

     if(!user){
        return <Navigate to="/login" />;
     }

     return children; 
}

export default ProtectedRoute;