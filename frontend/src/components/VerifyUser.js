import { fetchRegister } from '../api';
import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const VerifyUser = () => {
    const { verificationToken } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const register = async () => {
            try {
                const data = await fetchRegister({ verificationToken });
                localStorage.setItem('message', data.message);
                navigate('/');
            } catch (error) {
                return alert(error);
            }
        };

       register();
    }, [verificationToken, navigate]);
};

export default VerifyUser;