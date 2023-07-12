
import React, { useState } from 'react';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import Nav from 'react-bootstrap/Nav';
import Form from 'react-bootstrap/Form';
import axios from 'axios';
import { default as BootstrapNavbar } from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { getUser, resetUserSession } from '../service/AuthService';
import { useNavigate } from 'react-router-dom';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';


const updateAPIurl = 'https://lopzszq3r3.execute-api.us-east-1.amazonaws.com/prod/update';

const Navbar = ({ isOpen, setIsOpen }) => {
  const user = getUser();
  const name = user && user.name;
  const group =  user.group;
  const username = user.username;
  const oldpassword = user.password;
  const accessVariable = user.accessKeyId;
  const secretVariable = user.secretAccessKey;

  const navigate = useNavigate();

  const [showResetPasswordForm, setShowResetPasswordForm] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false); // State variable for password visibility
  const [emailInput, setEmailInput] = useState('');
  const [resetSuccess, setResetSuccess] = useState(false);



  const logoutHandler = () => {
    resetUserSession();
    navigate('/');
  };

  const resetPassword = () => {
    setShowResetPasswordForm(true);
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);

    if (e.target.value !== newPassword) {
      setError('New password and confirm password do not match.');
    } else {
      setError('');
    }
  };
  const handlePasswordChange = (e) => {
    const password = e.target.value;
    setNewPassword(password);
    let wrongM = [];

    if (password.length < 8) {
      wrongM.push('Password must be at least 8 characters long.');
    }
  
    if (!/(?=.*[a-z])/.test(password)) {
      wrongM.push('Password must contain at least one lowercase letter.');
    }
  
    if (!/(?=.*[A-Z])/.test(password)) {
      wrongM.push('Password must contain at least one uppercase letter.');
    }
  
    if (!/(?=.*\d)/.test(password)) {
      wrongM.push('Password must contain at least one digit.');
    }
  
    if (!/(?=.*[!@#$%^&*])/.test(password)) {
      wrongM.push('Password must contain at least one special character.');
    }
  
    if (password === oldPassword) {
      wrongM.push('New password cannot be the same as the old password.');
    }
  
    // setError(wrongM.length > 0 ? wrongM.join('\n') : '');
  };

  const handlePasswordResetSubmit = () => {
    // if (!bcrypt.compareSync(oldPassword, oldpassword)) {
    //   setError('Old password is incorrect.');
    //   return;
    // }

    if (newPassword === oldPassword) {
      setError("New password cannot be the same as the old password.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("New password and confirm password do not match.");
      return;
    }

    // Perform necessary actions to update the user's password
    // You can use the 'newPassword' state variable to get the new password value

    const requestBody = {
      username: username,
      email: emailInput,
      name: name,
      password: newPassword,
      group: group,
      accessKeyId: accessVariable,
      secretAccessKey: secretVariable
    };

    console.log("usernmae ", username)
    console.log("new password", newPassword)
    console.log("old password",oldpassword)
    console.log("email", emailInput)
    console.log("group", group)
    console.log("name", name)
    console.log("accesskey", accessVariable)
    console.log("keyid",secretVariable)
    

    axios.put(updateAPIurl, requestBody, {
      headers: {
        'x-api-key': 'YOUR_API_KEY'
      }
    })

    .then((response) => {
      console.log('User data stored in the database:', response.data);
      setResetSuccess(true);
      // Delay for 2 seconds before logging out
      setTimeout(() => {
        logoutHandler();
      }, 5000);
    })
    .catch((error) => {
      console.error('Error storing user data:', error);
    });
      
    
  };

  const handleClose = () => {
    setShowResetPasswordForm(false);
    setOldPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setError('');
  };

  return (
    <React.Fragment>
      <BootstrapNavbar
        collapseOnSelect
        expand="md"
        bg="light"
        variant="light"
        sticky="top"
        className="mb-3 w-100"
      >
        <BootstrapNavbar.Brand className="d-flex align-items-center justify-content-center">
          <Nav.Link>
            <MenuOpenIcon fontSize="large" onClick={() => setIsOpen((s) => !s)} />
          </Nav.Link>
          <span className="mx-3 text-muted d-none d-md-inline">Hello {name} !</span>
          <span className="text-muted d-none d-md-inline">
          </span>
        </BootstrapNavbar.Brand>

        <BootstrapNavbar.Toggle aria-controls="responsive-BootstrapNavbar-nav" />
        <BootstrapNavbar.Collapse id="responsive-BootstrapNavbar-nav">
          <Nav className="ms-auto">
            <NavDropdown title={name} id="Admin-nav-dropdown">
              <NavDropdown.Item>
                <input type="button" value="Logout" className="btn btn-danger" onClick={logoutHandler} />
              </NavDropdown.Item>
              <NavDropdown.Item>
                <input type="button" value="Reset Password" className="btn btn-warning" onClick={resetPassword} />
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </BootstrapNavbar.Collapse>
      </BootstrapNavbar>

      <Modal show={showResetPasswordForm} onHide={handleClose}>
        <Modal.Header closeButton closeVariant="white" className="text-bg-warning">
          <Modal.Title>Reset Password</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form>
            <div className="mb-3">
            <Form.Group className="mb-3">
                <Form.Label className="fw-bold">Email</Form.Label>
                <Form.Control
                  required
                  type="email"
                  placeholder="Enter email"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  variant="success"
                />
              </Form.Group>

            </div>
          
            <div className="mb-3">
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">Old Password</Form.Label>
                  <Form.Control required
                      type={showPassword ? 'text' : 'password'} // Use 'text' or 'password' based on password visibility
                      placeholder="Enter old password"
                      value={oldPassword}
                      onChange={(e) => setOldPassword(e.target.value)} 
                      variant="success" />
                </Form.Group>
            </div>
            <div className="mb-3">
               <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">New Password</Form.Label>
                  <Form.Control required
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={handlePasswordChange}
                    className={error ? 'is-invalid' :''}
                    variant="success" />
                    <div className="text-muted">
                        <ul className="mb-0">
                          <li className={newPassword.length >= 8 ? 'text-success' : 'text-danger'}>
                            Password must be at least 8 characters long.
                          </li>
                          <li className={/(?=.*[a-z])/.test(newPassword) ? 'text-success' : 'text-danger'}>
                            Password must contain at least one lowercase letter.
                          </li>
                          <li className={/(?=.*[A-Z])/.test(newPassword) ? 'text-success' : 'text-danger'}>
                            Password must contain at least one uppercase letter.
                          </li>
                          <li className={/(?=.*\d)/.test(newPassword) ? 'text-success' : 'text-danger'}>
                            Password must contain at least one digit.
                          </li>
                          <li className={/(?=.*[!@#$%^&*])/.test(newPassword) ? 'text-success' : 'text-danger'}>
                            Password must contain at least one special character [!@#$%^&*] .
                          </li>
                          <li className={newPassword !== oldPassword ? 'text-success' : 'text-danger'}>
                            New password cannot be the same as the old password.
                          </li>
                        </ul>
                      </div>
                </Form.Group>
            </div>
            <div className="mb-3">
                <Form.Group className="mb-3" controlId="confirmPassword">
                  <Form.Label className="fw-bold">Confirm Password</Form.Label>
                  <Form.Control required
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={handleConfirmPasswordChange}
                    variant="success" />
                </Form.Group>
            </div>
            {error && <div className="text-danger">{error}</div>}
            <Form.Group className="mb-3">
              <Form.Check
                type="checkbox"
                label="Show password"
                checked={showPassword}
                onChange={(e) => setShowPassword(e.target.checked)}
              />
            </Form.Group>
          </form>
          <Form.Group className="mb-3">
          {resetSuccess && (
  <div className="text-success">Password reset successfully! Logging out in 5 seconds...</div>
)}
            </Form.Group>
         

        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handlePasswordResetSubmit}>
            Reset
          </Button>
        </Modal.Footer>
      </Modal>
    </React.Fragment>
  );
}

export default Navbar;
