import { useState, useEffect } from 'react';

const ToastNotification = ({ message }) => {
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

    return <div className={`toast-notification ${isShow ? 'show' : ''}`}>{message}</div>;
};

export default ToastNotification;