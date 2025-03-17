import "../App.css";
import React, { useState, useEffect, useRef  } from "react";
import { Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import LicAgreement from "../components/LicAgreement";

const Login: React.FC = () => {
  const [email, setEmail] = useState(() => sessionStorage.getItem("savedEmail") || "");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(true); // 🔹 Default to true (check auto-login first)
  const [blurActive, setBlurActive] = useState(true);
  const [showAgreement, setShowAgreement] = useState(false);
  // const [userId, setUserId] = useState<string | null>(null);
  const navigate = useNavigate();
  const [isAllCorrect, setIsAllCorrect] = useState<boolean>(false);

  const currentSubRef = useRef<boolean | null>(null);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setBlurActive(false);
    }, 1000);

    return () => clearTimeout(timeout);
  }, []);

  // 🔹 Auto-login logic on component mount
  useEffect(() => {
    const attemptAutoLogin = async () => {
      try {
        if (!window.secureStorage) {
          setLoading(false);
          return;
        }
  
        const storedEmails = await window.secureStorage.getAllEmails();
        if (!storedEmails || storedEmails.length === 0) {
          setLoading(false);
          return;
        }
  
        const email = storedEmails[0]; // Pick the first saved email
        const storedToken = await window.secureStorage.getToken(email);
  
        if (!storedToken) {
          setLoading(false);
          return;
        }
  
        console.log(`🔑 Found token for ${email}. Verifying with backend...`);
        const response = await fetch("http://localhost:2756/api/auth/validate", {
          method: "POST",
          headers: { "Authorization": `Bearer ${storedToken}` },
        });
  
        const data = await response.json();
        if (response.ok && data.user) {
          console.log("✅ Token valid. Auto-logging in...");
          currentSubRef.current = data.user.current; 
          

          if (!data.user.accept) {
            setShowAgreement(true);
          } else if (data.user.current) {
            navigate("/LoggedIn", { state: { email: data.user.email, current: data.user.current } });
          } else {
            navigate("/NotLoggedIn", { state: { email: data.user.email, current: data.user.current } });
          }
          return;
        }
  
        // If token is invalid, try to refresh it
        console.log("⚠️ Token expired or invalid. Attempting refresh...");
        const refreshResponse = await fetch("http://localhost:2756/api/auth/refresh-token", {
          method: "POST",
          headers: { "Authorization": `Bearer ${storedToken}` },
        });
  
        const refreshData = await refreshResponse.json();
        if (refreshResponse.ok && refreshData.token) {
          console.log("✅ Token refreshed. Updating secure storage...");
          await window.secureStorage.saveToken(email, refreshData.token);
          navigate("/LoggedIn", { state: { email, current: true } });
          return;
        }
  
        console.log("❌ Refresh failed. Showing login screen...");
        setLoading(false);
      } catch (error) {
        console.error("⚠️ Auto-login failed:", error);
        setLoading(false);
      }
    };
  
    attemptAutoLogin();
  }, [navigate]);
  

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!email || !password) {
      alert("Please complete all fields.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://localhost:2756/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Connection": "keep-alive",
        },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          setIsAllCorrect(true);
          return;
        }
        throw new Error(`Server responded with ${response.status} ${response.statusText}`);
      }

      if (data?.user && data?.token) {
        console.log("✅ User logged in:", data.user);

        if (window.secureStorage) {
          await window.secureStorage.saveToken(data.user.email, data.token);
        }
  
        sessionStorage.setItem("savedEmail", data.user.email);
  
   
        currentSubRef.current = data.user.current;
        

        if (!data.user.accept) { 
          setShowAgreement(true); 
        } else if (data.user.current && data.user.accept) {
          navigate("/LoggedIn", { state: { email: data.user.email, current: data.user.current } });
        } else if (!data.user.current && data.user.accept) {
          navigate("/NotLoggedIn", { state: { email: data.user.email, current: data.user.current } });
        }
      } else {
        alert(data?.message || "Login failed. Please try again.");
      }
    } catch (error) {
      console.error("❌ Login error:", error);
      alert("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptAgreement = () => {
    setShowAgreement(false);
    navigate(
      currentSubRef.current ? "/LoggedIn" : "/NotLoggedIn",
      { state: { email, current: currentSubRef.current } }
    );
  };


  return loading ? (
    <div className="spinner-overlay">
      <div className="spinner"></div>
    </div>
  ) : (
    <div className={`center_wanted ${blurActive ? "blurred-screen" : ""}`}>
      {blurActive && (
        <div className="spinner-overlay">
          <div className="spinner"></div>
        </div>
      )}

      <div className="div_for_login">
        <p className="nexTitle">Nexumed</p>
        <p className="nexSubTitle">Connecting medicine</p>

        {loading ? (
          <div className="spinner-container">
            <p className="settingUpWorkPlace">Setting up your workspace... Please wait.</p>
            <div className="spinner"></div>
          </div>
        ) : (
          <form onSubmit={handleLogin}>
            <div className="form_group">
              <Row>
                <Col sm={6}>
                  <label htmlFor="formBasicEmail" className="form_label">Email address</label>
                </Col>
                <Col sm={6}>
                  <input
                    type="email"
                    placeholder="Enter email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="form_control"
                    id="formBasicEmail"
                    required
                  />
                </Col>
              </Row>
            </div>
            <div className="form_group">
              <Row>
                <Col sm={6}>
                  <label htmlFor="formBasicPassword" className="form_label">Password</label>
                </Col>
                <Col sm={6}>
                  <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="form_control"
                    id="formBasicPassword"
                    required
                  />
                </Col>
              </Row>
            </div>
            <div className="center_wanted">
              <button type="submit" className="sub_button" disabled={loading || blurActive}>
                {loading ? 'Logging in...' : 'Login'}
              </button>
            </div>
          </form>
        )}
        {isAllCorrect && (
          <div className="center_wanted">
            <div className="inCorrectLogin">
              <p className="settingUpWorkPlace">Invalid email or password. Please try again.</p>
              <button className="sub_button" onClick={() => {
                setIsAllCorrect(false);
                setEmail("");
                setPassword("");
              }}>
                Close
              </button>
            </div>
          </div>
        )}
      </div>
      {showAgreement && email && <LicAgreement userEmail={email} onAccept={handleAcceptAgreement} />}
    </div>
  );
};

export default Login;
