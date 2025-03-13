import '../App.css'
import React from 'react';
import logo from '../assets/nexumedLogo.png';
// import Register from './Register'
// import { Link, useNavigate } from 'react-router-dom';


/**
 * Login Component
 * 
 * This component provides a login form for users to authenticate. It updates the user context
 * upon successful login, stores the JWT token for subsequent requests, and redirects to the
 * patient list page. The form includes a loading state to indicate login processing.
 * 
 * @component
 * @example
 * <Login />
 */

const LoggedIn: React.FC = () => {


  return (
    <div>
      <div className="center_wanted">
        <div>
          <p className="nexTitle">Nexumed</p>
          <p className="nexSubTitle">Connecting medicine</p>
        </div>
      </div>
      <div className="center_wanted">
        <img className="nexLogo" src={logo} alt="Nexumed Logo" />
      </div>
      <div className="center_wanted">
        <p className="nexSubTitle">Currently Connected</p>
    </div>
    </div>
  );
};

export default LoggedIn;