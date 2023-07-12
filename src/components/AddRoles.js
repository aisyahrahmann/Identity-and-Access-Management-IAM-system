import { useRef, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Alert from 'react-bootstrap/Alert';
import Modal from 'react-bootstrap/Modal';
import { IAMClient, CreateRoleCommand } from '@aws-sdk/client-iam';

const CreateRoleModal = ({ handleClose, show }) => {
  const formRef = useRef(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [message, setMessage] = useState('');

  const handleCreateRole = async (e) => {
    e.preventDefault();

    const roleName = formRef.current.roleName.value.trim();
    const assumeRolePolicy = formRef.current.assumeRolePolicy.value.trim();

    setErrorMessage('');
    if (!roleName) {
      return setErrorMessage('Please enter a role name.');
    }

    if (!assumeRolePolicy) {
      return setErrorMessage('Please enter an assume role policy.');
    }

    try {
      const iamClient = new IAMClient({
        region: 'us-east-1', // Replace with your desired AWS region
        credentials: {
          accessKeyId: 'YOUR_ACCESS_KEY',
        secretAccessKey: 'YOUR_SECRET_ACCESS_KEY',
        },
      });

      const createRoleParams = {
        RoleName: roleName,
        AssumeRolePolicyDocument: assumeRolePolicy,
      };

      const result = await iamClient.send(new CreateRoleCommand(createRoleParams));
      setMessage('Role created successfully');
      console.log('Role created:', result);

      handleClose();
    } catch (err) {
      console.error('Error creating role:', err);
      setErrorMessage(err.message);
    }
  };

  return (
    <>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton closeVariant="white" className="text-bg-warning">
          <Modal.Title>Create Role</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleCreateRole} ref={formRef}>
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">Role Name</Form.Label>
              <Form.Control required placeholder="Enter role name" type="text" name="roleName" variant="success" />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">Assume Role Policy</Form.Label>
              <Form.Control
                as="textarea"
                rows={5}
                name="assumeRolePolicy"
                placeholder="Enter assume role policy JSON"
              />
            </Form.Group>

            {errorMessage && <Alert variant="danger" dismissible onClose={() => setErrorMessage('')}>{errorMessage}</Alert>}
            {message && <p>Role successfully created</p>}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="outline-secondary"
            className="me-auto"
            onClick={(e) => {
              formRef.current.reset();
              setErrorMessage('');
              setMessage('');
            }}
          >
            Reset fields
          </Button>
          <Button variant="danger" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="success" onClick={handleCreateRole}>
            Create Role
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default CreateRoleModal;

