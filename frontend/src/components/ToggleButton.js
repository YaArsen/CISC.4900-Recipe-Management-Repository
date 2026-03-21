import Delete from './Delete';
import Logout from './Logout';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ToggleButton = ({ page }) => {
    const [isOpen, setIsOpen] = useState(false); // State to track if the menu is open (false) or closed (true)
    const navigate = useNavigate();

    return (
        <div className='toggle-btn-container'>
            {/* Hamburger button with 3 divs for styling */}
            <div className={isOpen ? 'hamb-btn change' : 'hamb-btn'} onClick={() => setIsOpen(!isOpen)}>
                <span></span>
                <span></span>
                <span></span>
            </div>

            {/* Conditionally render the navigation menu only if isOpen is true */}
            <div className={isOpen ? 'nav-menu show' : 'nav-menu'}>
                <button onClick={() => navigate(`/${page}/account`)}>Account</button>
                <Delete />
                <Logout />
            </div>
        </div>
    );
};

export default ToggleButton;