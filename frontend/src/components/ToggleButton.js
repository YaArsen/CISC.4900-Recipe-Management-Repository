import Delete from './Delete';
import Logout from './Logout';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ToggleButton = () => {
    const [isOpen, setIsOpen] = useState(false); // State to track if the menu is open (false) or closed (true)
    const navigate = useNavigate();

    return (
        <>
            {/* Hamburger button with 3 divs for styling */}
            <button className='hamb-btn' onClick={() => setIsOpen(!isOpen)}>
                <div className='bar'></div>
                <div className='bar'></div>
                <div className='bar'></div>
            </button>

            {/* Conditionally render the navigation menu only if isOpen is true */}
            {isOpen && <nav className='nav-menu'>
                <button onClick={() => navigate('/account')}>Account</button>
                <Delete />
                <Logout />
            </nav>}
        </>
    );
};

export default ToggleButton;