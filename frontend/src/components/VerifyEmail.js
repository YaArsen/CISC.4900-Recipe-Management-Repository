import { fetchRegister } from '../api';
import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const VerifyEmail = () => {
    const { verificationToken } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const verifyEmail = async () => {
            try {
                const data = await fetchRegister({ verificationToken });
                localStorage.setItem('message', data.message);
                navigate('/');
            } catch (error) {
                alert(error);
            }
        };

       verifyEmail();
    }, [verificationToken, navigate]);
};

export default VerifyEmail;