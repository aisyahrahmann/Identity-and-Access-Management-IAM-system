import { useRef, useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Alert from 'react-bootstrap/Alert';
import axios from 'axios';
import Modal from 'react-bootstrap/Modal';
import { checkUserExists, createUser } from './UserIAM';
import { IAMClient, ListGroupsCommand, AddUserToGroupCommand, CreateAccessKeyCommand } from '@aws-sdk/client-iam';

const registerUrl = 'https://lopzszq3r3.execute-api.us-east-1.amazonaws.com/prod/register';


const AddUserModal = ({ handleClose, show, setUsers }) => {
  const formRef = useRef(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [userExists, setUserExists] = useState(false);
  const [message, setMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false); // State variable for password visibility
  const [groups, setGroups] = useState([{ value: '', label: 'Select Group', disabled: true }]);

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const iamClient = new IAMClient({
          region: 'us-east-1', // Replace with your desired AWS region
          credentials: {
            accessKeyId: "AKIA5SFSGTHHY56JRHWV",
            secretAccessKey: "knOSZ3ldNK/5a9e8/nsaZTmgBM9Cqtk7DXnZu78B",
          },
        });

        const { Groups } = await iamClient.send(new ListGroupsCommand({}));

        const formattedGroups = Groups.map((group) => ({
          value: group.GroupName,
          label: group.GroupName,
        }));

        setGroups(formattedGroups);
      } catch (err) {
        console.error(err);
        setErrorMessage('Error fetching groups');
      }
    };

    fetchGroups();
  }, []);

  const createAccessKey = async (userNameIAM) => {
    try {
      const iamClient = new IAMClient({
        region: 'us-east-1', // Replace with your desired AWS region
        credentials: {
          accessKeyId: "AKIA5SFSGTHHY56JRHWV",
          secretAccessKey: "knOSZ3ldNK/5a9e8/nsaZTmgBM9Cqtk7DXnZu78B",
        },
      });

      const createAccessKeyCommand = new CreateAccessKeyCommand({
        UserName: userNameIAM,
      });

      const response = await iamClient.send(createAccessKeyCommand);
      return response.AccessKey;
    } catch (err) {
      console.error('Error creating access key:', err);
      throw err;
    }
  };

  const handleAddUser = async (e) => {
    e.preventDefault();

    const userNameIAM = formRef.current.userName.value.trim();
    const selectedGroup = formRef.current.group.value;
    const email = formRef.current.email.value.trim();
    const password = formRef.current.password.value.trim();
    const name = formRef.current.name.value.trim();


    setErrorMessage('');
    if (!userNameIAM) {
      return setErrorMessage('Please enter a username.');
    }

    try {
      const exists = await checkUserExists(userNameIAM);
      setUserExists(exists);

      if (!exists) {
        const result = await createUser(userNameIAM);
        await assignUserToGroup(userNameIAM, selectedGroup);
        const keys = await createAccessKey(userNameIAM);
        setMessage('User created successfully');

        console.log('User', result, 'created with access key', keys);

        const accessVariable = keys.AccessKeyId;
        const secretVariable = keys.SecretAccessKey;

        console.log('accesskeyID', accessVariable);
        console.log('secret access key id', secretVariable);

        // Send data to the API
        const requestBody = {
          username: userNameIAM,
          email: email,
          name: name,
          password: password,
          group: selectedGroup,
          accessKeyId: accessVariable,
          secretAccessKey: secretVariable
        };

        // const requestConfig = {
        //   headers: {
        //     'x-api-key': 'hgy7XNweFw5F3cu28m2048PjpgdfSlJI1kOle6im'
        //   }
        // }
        
        // axios.post(registerUrl, requestBody, requestConfig)
        //   .then(response => {
        //     setMessage('Registration Successful');
        //   })
        //   .catch(error => {
        //     if (error.response.status === 401) {
        //       setMessage(error.response.data.message);
        //     } else {
        //       setMessage('Sorry, the backend server is down! Please try again later.');
        //     }
        //   });

        axios.post(registerUrl, requestBody, {
          headers: {
            'x-api-key': 'hgy7XNweFw5F3cu28m2048PjpgdfSlJI1kOle6im'
          }
        })

        .then(response => {
          console.log('User data stored in the database:', response.data);
        })
        .catch(error => {
          console.error('Error storing user data:', error);
        });

        console.log('User', result, 'created with access key', keys);

      }
    } catch (err) {
      console.error('Error creating user:', err);
      setErrorMessage(err.message);
    }
  };


  const assignUserToGroup = async (userNameIAM, groupName) => {
    try {
      const iamClient = new IAMClient({
        region: 'us-east-1', // Replace with your desired AWS region
        credentials: {
          accessKeyId: "AKIA5SFSGTHHY56JRHWV",
          secretAccessKey: "knOSZ3ldNK/5a9e8/nsaZTmgBM9Cqtk7DXnZu78B",
        },
      });

      await iamClient.send(new AddUserToGroupCommand({ GroupName: groupName, UserName: userNameIAM }));
    } catch (err) {
      console.error('Error assigning user to group:', err);
      setErrorMessage('Error assigning user to group');
    }
  };

  return (
    <>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton closeVariant="white" className="text-bg-warning">
          <Modal.Title>Add New User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleAddUser} ref={formRef}>
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">User Name</Form.Label>
              <Form.Control required placeholder="Enter userName" type="text" name="userName" variant="success" />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">Select IAM Group</Form.Label>
              <Form.Control as="select" name="group" defaultValue="">
                <option value="">Select Group</option>
                {groups.map((group) => (
                  <option key={group.value} value={group.value}>
                    {group.label}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">Email</Form.Label>
              <Form.Control required placeholder="Enter email" type="text" name="email" variant="success" />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">Name</Form.Label>
              <Form.Control required placeholder="Enter name" type="text" name="name" variant="success" />
            </Form.Group>

            <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">New Password</Form.Label>
                  <Form.Control required placeholder="Enter Password" type={showPassword ? 'text' : 'password'} name="password" variant="success" />
            </Form.Group>

            
          </Form>

          <Form.Group className="mb-3">
              <Form.Check
                type="checkbox"
                label="Show password"
                checked={showPassword}
                onChange={(e) => setShowPassword(e.target.checked)}
              />
            </Form.Group>
          
            <Form.Group className="mb-3">
            {errorMessage && <Alert variant="danger" dismissible onClose={() => setErrorMessage('')}>{errorMessage}</Alert>}
            {userExists && <Alert variant="danger" dismissible onClose={() => setUserExists('')}>User already exists.</Alert>}
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
              setUserExists(false);
              setMessage('');
            }}
          >
            Reset fields
          </Button>
          <Button variant="danger" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="success" onClick={handleAddUser}>
            Add User
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default AddUserModal;
