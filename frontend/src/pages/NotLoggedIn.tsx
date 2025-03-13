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

const NotLoggedIn: React.FC = () => {


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
      <div>
        <p className="nexSubTitle_not">You are not currently connected</p>
        <p className="nexSubTitle_not">Your subscription may have expired</p>
        <p className="nexSubTitle_not">Please re-subcribe to continue</p>
        <p className="nexSubTitle_not">Visit</p>
        <a href="https://www.nexumed.eu/" className="nexSubTitle_not_a">www.nexumed.eu</a>
        <p className="nexSubTitle_not">For more information, please contact our customer service.</p>
        <p className="nexSubTitle_not">Or email us at <em>info@nexumed.eu</em></p>
        
    </div>
    </div>
  );
};

export default NotLoggedIn;