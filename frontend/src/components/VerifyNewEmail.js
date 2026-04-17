import { fetchUpdateEmail } from '../api';
import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const VerifyNewEmail = () => {
    const { page, verificationToken } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const verifyNewEmail = async () => {
            try {
                const data = await fetchUpdateEmail({ verificationToken });
                localStorage.setItem('message', data.message);
                localStorage.setItem('token', data.token);
                navigate(`/${page}/account`);
            } catch (error) {
                alert(error);
            }
        };

       verifyNewEmail();
    }, [page, verificationToken, navigate]);
};

export default VerifyNewEmail;