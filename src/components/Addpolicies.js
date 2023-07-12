import { useRef, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Alert from 'react-bootstrap/Alert';
import Modal from 'react-bootstrap/Modal';
import { IAMClient, CreatePolicyCommand } from '@aws-sdk/client-iam';

const CreatePolicyModal = ({ handleClose, show }) => {
  const formRef = useRef(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [message, setMessage] = useState('');

  const handleCreatePolicy = async (e) => {
    e.preventDefault();

    const policyName = formRef.current.policyName.value.trim();
    const policyDocument = formRef.current.policyDocument.value;

    setErrorMessage('');
    if (!policyName) {
      return setErrorMessage('Please enter a policy name.');
    }

    if (!policyDocument) {
      return setErrorMessage('Please enter a policy document.');
    }

    try {
      const iamClient = new IAMClient({
        region: 'us-east-1', // Replace with your desired AWS region
        credentials: {
			accessKeyId: 'YOUR_ACCESS_KEY',
    secretAccessKey: 'YOUR_SECRET_ACCESS_KEY',
        }
      });

      const createPolicyParams = {
        PolicyName: policyName,
        PolicyDocument: policyDocument,
      };

      const result = await iamClient.send(new CreatePolicyCommand(createPolicyParams));
      setMessage('Policy created successfully');
      console.log('Policy created:', result);

    } catch (err) {
      console.error('Error creating policy:', err);
      setErrorMessage(err.message);
    }
  };

  return (
    <>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton closeVariant="white" className="text-bg-warning">
          <Modal.Title>Create Custom Policy</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleCreatePolicy} ref={formRef}>
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">Policy Name</Form.Label>
              <Form.Control required placeholder="Enter policy name" type="text" name="policyName" variant="success" />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">Policy Document</Form.Label>
              <Form.Control as="textarea" rows={5} name="policyDocument" placeholder="Enter policy JSON" />
            </Form.Group>

            
           
            <Form.Group className="mb-3">
            {errorMessage && <Alert variant="danger" dismissible onClose={() => setErrorMessage('')}>{errorMessage}</Alert>}
            {message && <Alert variant="success" dismissible onClose={() => setMessage('')}>{message}</Alert>}
            
            </Form.Group>
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
          <Button variant="success" onClick={handleCreatePolicy}>
            Create Policy
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default CreatePolicyModal;
