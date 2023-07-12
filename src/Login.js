import React, { useState } from "react";
import axios from "axios";
import { setUserSession } from "./service/AuthService";
import { useNavigate } from "react-router-dom";
import companyLogo from "./components/computionbg.png";

import "./Login.css";

const loginAPIurl = "https://lopzszq3r3.execute-api.us-east-1.amazonaws.com/prod/login";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const submitHandler = (event) => {
    event.preventDefault();
    if (username.trim() === "" || password.trim() === "") {
      setErrorMessage("Both username and password are required");
      return;
    }

    setErrorMessage(null);
    const requestConfig = {
      headers: {
        "x-api-key": "hgy7XNweFw5F3cu28m2048PjpgdfSlJI1kOle6im",
      },
    };

    const requestBody = {
      username: username,
      password: password,
    };

    axios
      .post(loginAPIurl, requestBody, requestConfig)
      .then((response) => {
        // setUserSession(response.data.user, response.data.token);
        // navigate("/Dashboard"); // Use the navigate function to redirect to "/Dashboard"
        const { user, token } = response.data;
        setUserSession(user, token);

        // if (user.group === "admin"){
        //   navigate("/Dashboard");
        // }else if (user.group==="AdvanceDB" || user.group ==="BeginnerDB"){
        //   navigate("/ResourcesPage");
        // }else if (user.group==="MEOS" || user.group ==="meos"){
        //   navigate("/S3Page");
        // }else{
        //   navigate("/Selectgroup");
        // }

        if (user.group === "admin" || user.group === "Admin"){
          navigate("/Dashboard");
        }else{
          navigate("/ResourcesPage");
        }

      })
      .catch((error) => {
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
          setErrorMessage(error.response.data.message);
        } else if (error.response) {
          setErrorMessage("An error occurred with the API request.");
        } else {
          setErrorMessage("Sorry, there was an issue connecting to the server. Please try again later.");
        }
      });
  };

  return (
    <div className="background">

    <div className="login-container">
          <div className="login-form">
            <img src={companyLogo} alt="Company Logo" className="logo" />
            <h5>Login</h5>
            <form onSubmit={submitHandler}>
              <div className="form-group">
                <input type="text" value={username} onChange={(event) => setUsername(event.target.value)} placeholder="Username" />
              </div>
              <div className="form-group">
                <div className="password-input-container">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Password"
                  />
                  <label className="show-password-label">
                    <input
                      type="checkbox"
                      checked={showPassword}
                      onChange={() => setShowPassword(!showPassword)}
                    />
                     Show Password
                  </label>
                </div>
              </div>
              <div className="form-group">
                <input type="submit" value="Login" />
              </div>
              {errorMessage && <p className="message">{errorMessage}</p>}
            </form>
          </div>
        </div>
    </div>
    
  );
};

export default Login;
