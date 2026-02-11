import Delete from './Delete';
import Logout from './Logout';
import { useState } from 'react';

const ToggleButton = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <button className='hamb-btn' onClick={() => setIsOpen(!isOpen)}>
                <div className='bar'></div>
                <div className='bar'></div>
                <div className='bar'></div>
            </button>
            {isOpen && <nav className='nav-menu'>
                <Delete />
                <Logout />
            </nav>}
        </>
    );
};

export default ToggleButton;