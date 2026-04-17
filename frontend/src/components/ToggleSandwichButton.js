import Delete from './Delete';
import LogOut from './LogOut';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ToggleSandwichButton = ({ page }) => {
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
                <button type='button' onClick={() => navigate(`/${page}/account`)}>Account</button>
                <Delete />
                <LogOut />
            </div>
        </div>
    );
};

export default ToggleSandwichButton;