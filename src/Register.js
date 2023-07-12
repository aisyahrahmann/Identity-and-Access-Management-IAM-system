import React, { useState } from 'react';
import axios from 'axios';
import './Register.css';
import companyLogo from "./components/computionbg.png";

const registerUrl = 'https://lopzszq3r3.execute-api.us-east-1.amazonaws.com/prod/register';


const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  // const [accessKeyId,setAccessKeyId] = useState('');
  // const [secretAccessKey,setSecretAccessKey] = useState('');
  // const [group,setGroup]= useState('');
  const [message, setMessage] = useState(null);

  const submitHandler = (event) => {
    event.preventDefault();
    if (username.trim() === '' || email.trim() === '' || name.trim() === '' || password.trim() === '') {
      setMessage('All fields are required');
      return;
    } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/.test(password)) {
      setMessage('Password must contain at least one uppercase letter, one lowercase letter, one digit, one symbol, and at least 8 characters.');
      return;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setMessage('The email must be valid. E.g., example@example.com');
      return;
    } else if (username.length < 4) {
      setMessage('The username must have at least 4 characters');
      return;
    }

    setMessage(null);
    const requestConfig = {
      headers: {
        'x-api-key': 'YOUR_API_KEY'
      }
    }
    const requestBody = {
      username: username,
      email: email,
      name: name,
      password: password
    }
    axios.post(registerUrl, requestBody, requestConfig)
      .then(response => {
        setMessage('Registration Successful');
      })
      .catch(error => {
        if (error.response.status === 401) {
          setMessage(error.response.data.message);
        } else {
          setMessage('Sorry, the backend server is down! Please try again later.');
        }
      });
  }

  return (
    <div className="register-container">
      <img src={companyLogo} alt="Company Logo" className="logo" />
      <form onSubmit={submitHandler}>
        <h5>Register</h5>
        <div className="form-group">
          <input type="text" value={name} onChange={event => setName(event.target.value)} placeholder="Name" />
        </div>
        <div className="form-group">
          <input type="text" value={email} onChange={event => setEmail(event.target.value)} placeholder="Email" />
        </div>
        <div className="form-group">
          <input type="text" value={username} onChange={event => setUsername(event.target.value)} placeholder="Username" />
        </div>
        <div className="form-group">
          <input type="password" value={password} onChange={event => setPassword(event.target.value)} placeholder="Password" />
        </div>
        <div className="form-group">
          <input type="submit" value="Register" />
        </div>
      </form>
      {message && <p className="message">{message}</p>}
    </div>
  )
}

export default Register;
