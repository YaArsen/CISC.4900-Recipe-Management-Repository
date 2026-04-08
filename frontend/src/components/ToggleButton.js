import Delete from './Delete';
import Logout from './Logout';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ToggleButton = ({ page }) => {
    const [isOpen, setIsOpen] = useState(false); // State to track if the menu is open or closed
    const navigate = useNavigate();

    return (
        <div className='sandwich-button-container'>
            {/* Sandwich button with 3 spans for styling */}
            <div className={`sandwich-button ${isOpen ? 'change' : ''}`} onClick={() => setIsOpen(!isOpen)}>
                <span></span>
                <span></span>
                <span></span>
            </div>

            {/* Conditionally render the navigation menu only if isOpen is true */}
            <div className={`nav-menu ${isOpen ? 'show' : ''}`}>
                <button onClick={() => navigate(`/${page}/account`)}>Account</button>
                <Delete />
                <Logout />
            </div>
        </div>
    );
};

export default ToggleButton;