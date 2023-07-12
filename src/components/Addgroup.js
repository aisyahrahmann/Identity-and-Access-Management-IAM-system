import React, { useRef, useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Alert from 'react-bootstrap/Alert';
import Modal from 'react-bootstrap/Modal';
import { IAMClient, ListUsersCommand, CreateGroupCommand, AddUserToGroupCommand } from '@aws-sdk/client-iam';

const AddGroup = ({ handleClose, show, setUsers }) => {
  const formRef = useRef(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [errMessage, setErrMessage] = useState('');
  const [message, setMessage] = useState('');
  const [userList, setUserList] = useState([]);

  useEffect(() => {
    // Fetch the list of IAM users
    const fetchUserList = async () => {
      const client = new IAMClient({
        region: 'us-east-1', // Update with your desired region
        credentials: {
          accessKeyId: 'YOUR_ACCESS_KEY',
    secretAccessKey: 'YOUR_SECRET_ACCESS_KEY',
      }
      });

      try {
        const command = new ListUsersCommand({});
        const response = await client.send(command);
        const users = response.Users;
        setUserList(users);
      } catch (err) {
        console.log('Error fetching user list:', err);
      }
    };

    fetchUserList();
  }, []);

  const handleAddGroup = async (e) => {
    e.preventDefault();

    const groupName = formRef.current.groupName.value.trim();
    const selectedUser = formRef.current.userName.value;

    setErrorMessage('');

    if (!groupName) {
      return setErrorMessage('Please enter a group name.');
    }

    try {
      const client = new IAMClient({
        region: 'us-east-1', // Update with your desired region
        credentials: {
          accessKeyId: 'YOUR_ACCESS_KEY',
    secretAccessKey: 'YOUR_SECRET_ACCESS_KEY',
      }
      });

      // Create the group
      const createGroupCommand = new CreateGroupCommand({
        GroupName: groupName,
      });
      await client.send(createGroupCommand);

      // Assign the user to the group
      const addUserToGroupCommand = new AddUserToGroupCommand({
        GroupName: groupName,
        UserName: selectedUser,
      });
      await client.send(addUserToGroupCommand);

      console.log('Group created:', groupName, selectedUser);
      setMessage('Group created successfully');
    } catch (err) {
      setErrMessage(err.message);
    }
  };

  return (
    <>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton closeVariant="white" className="text-bg-warning">
          <Modal.Title>Add New Group</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleAddGroup} ref={formRef}>
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">Group Name</Form.Label>
              <Form.Control
                required
                placeholder="Enter group name"
                type="text"
                name="groupName"
                variant="success"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">User Name</Form.Label>
              <Form.Select required name="userName">
                <option value="">Choose user name</option>
                {userList.map((user) => (
                  <option key={user.UserName} value={user.UserName}>
                    {user.UserName}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            {errorMessage && (
              <Alert variant="danger" dismissible onClose={() => setErrorMessage('')}>
                {errorMessage}
              </Alert>
            )}
          </Form>
          <Form.Group className="mb-3">
            {errMessage && <Alert variant="danger" dismissible onClose={() => setErrMessage('')}>{errMessage}</Alert>}
            {message && <Alert variant="success" dismissible onClose={() => setMessage('')}>{message}</Alert>}
            
            </Form.Group>

        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="outline-secondary"
            className="me-auto"
            onClick={(e) => {
              formRef.current.reset();
              setErrorMessage('');
            }}
          >
            Reset fields
          </Button>
          <Button variant="danger" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="success" onClick={handleAddGroup}>
            Add Group
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default AddGroup;
