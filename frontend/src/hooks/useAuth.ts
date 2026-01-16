import { useState, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { loginUser, registerUser } from '../api/auth';

const useAuth = () => {
    const { setAuthData } = useContext(AuthContext);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const login = async (email, password) => {
        setLoading(true);
        setError(null);
        try {
            const data = await loginUser(email, password);
            setAuthData(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const register = async (email, password) => {
        setLoading(true);
        setError(null);
        try {
            const data = await registerUser(email, password);
            setAuthData(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        setAuthData(null);
    };

    return { login, register, logout, error, loading };
};

export default useAuth;