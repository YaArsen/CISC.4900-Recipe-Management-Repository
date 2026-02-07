import Logout from './Logout';
import Delete from './Delete';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ToggleButton = () => {
  const [isActive, setIsActive] = useState(false);
  const navigate = useNavigate();
  
  return (
    <>
      <button onClick={() => setIsActive(!isActive)} className="hamb-btn">
        <span className="bar"></span>
        <span className="bar"></span>
        <span className="bar"></span>
      </button>
      {isActive && (
        <nav className="nav-menu">
          <button onClick={() => navigate('/upload')}>Upload picture</button>
          <button onClick={() => navigate('/change-username')}>Change username</button>
          <button onClick={() => navigate('/change-email')}>Change email</button>
          <button onClick={() => navigate('/change-password')}>Change password</button>
          <button onClick={() => navigate('/favorites')}>Favorites</button>
          <button onClick={() => navigate('/liked')}>Liked</button>
          <button onClick={() => navigate('/commented')}>Commented</button>
          <Logout />
          <Delete />
        </nav>
      )}
    </>
  );
};

export default ToggleButton;