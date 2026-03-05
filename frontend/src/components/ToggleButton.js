import Delete from './Delete';
import Logout from './Logout';
import { useState } from 'react';

const ToggleButton = () => {
    const [isOpen, setIsOpen] = useState(false); // State to track if the menu is open (false) or closed (true)

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
                <Delete />
                <Logout />
            </nav>}
        </>
    );
};

export default ToggleButton;