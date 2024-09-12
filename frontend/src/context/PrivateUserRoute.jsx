import React, { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom';
import {validateUserToken} from '../services/authServices'

const PrivateUserRoute = ({children}) => {
    const [redirectionHome, setRedirectionHome] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('authToken');
        if(token){
            validateUserToken(token)
            .then(session => {
                if(session){
                    setRedirectionHome(false);
                } else {
                    setRedirectionHome(true);
                    localStorage.removeItem('authToken');
                }
            }).catch(err => {
                setRedirectionHome(true);
                localStorage.removeItem('authToken');
            })
        }
    },[])

    return (
        <>
            {!redirectionHome ? children : <Navigate to="/" />}
        </>
    )
}

export default PrivateUserRoute
