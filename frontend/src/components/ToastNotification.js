import { useState, useEffect } from 'react';

const ToastNotification = ({ message, setMessage }) => {
    const [isShow, setIsShow] = useState(false);

    useEffect(() => {
        if (message) {
           setIsShow(true);

           const timer = setTimeout(() => {
                setIsShow(false);
            }, 3000);
    
            return () => clearTimeout(timer);
        }
    }, [message]);

    useEffect(() => {
        if (message) {

           const timer = setTimeout(() => {
                setMessage('');
            }, 5000);
    
            return () => clearTimeout(timer);
        }
    }, [message, setMessage]);

    return <div className={`toast-notification ${isShow ? 'show' : ''}`}>{message}</div>;
};

export default ToastNotification;