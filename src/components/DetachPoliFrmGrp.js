import React, { useState, useEffect } from 'react';
import { IAMClient, ListGroupsCommand,ListAttachedGroupPoliciesCommand, DetachGroupPolicyCommand } from '@aws-sdk/client-iam';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { Collapse } from 'react-bootstrap';
import Alert from 'react-bootstrap/Alert';

const DetachPoliGrp = () => {
  const [groups, setGroups] = useState([]); // List of IAM Groups
  const [selectedGroup, setSelectedGroup] = useState(''); // Selected IAM Group
  const [policyArn, setPolicyArn] = useState(''); // ARN of the policy to be detached
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isCollapsed, setIsCollapsed] = useState(true); // Collapsible state


  const handleGroupChange = (event) => {
    setSelectedGroup(event.target.value);
  };

  const handlePolicyArnChange = (event) => {
    setPolicyArn(event.target.value);
  };

  const detachPolicyFromGroup = async () => {
    try {
      const iamClient = new IAMClient({
        region: 'us-east-1', // Replace with your desired AWS region
        credentials: {
            accessKeyId: "AKIA5SFSGTHHY56JRHWV",
            secretAccessKey: "knOSZ3ldNK/5a9e8/nsaZTmgBM9Cqtk7DXnZu78B",
        }
      });

      const { AttachedPolicies } = await iamClient.send(new ListAttachedGroupPoliciesCommand({
        GroupName: selectedGroup,
      }));
  
      const policyFound = AttachedPolicies.find((policy) => policy.PolicyArn === policyArn);
  
      if (!policyFound) {
        setError(`Policy ${policyArn} is not attached to group ${selectedGroup}`);
        return;
      }

      await iamClient.send(new DetachGroupPolicyCommand({
        GroupName: selectedGroup,
        PolicyArn: policyArn,
      }));

      setMessage(`Successfully detached policy ${policyArn} from group ${selectedGroup}`);
    } catch (err) {
      console.error(err);
      setError('Error detaching policy from group');
    }
  };

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
        setError('Error fetching groups');
      }
    };

    fetchGroups();
  }, []);

  const handleToggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className="m-3 my-4">
      <div className="d-flex align-items-center" >
        <h5 style={{cursor: 'pointer' , flex: '1' }}>Detach policy from group</h5>
        <button onClick={handleToggleCollapse} size="small" style={{ border: 'none', background: 'none' }}>
          {isCollapsed ? <ExpandMoreIcon /> : <ExpandLessIcon />}
        </button>
      </div>
      <Collapse in={!isCollapsed}>
        <div>
          <div className="d-flex align-items-center">
            <div className="flex-grow-1 me-3">
              <label className="me-2">Select IAM Group:</label>
              <select value={selectedGroup} onChange={handleGroupChange}>
                <option value="">Select Group</option>
                {groups.map((group) => (
                  <option key={group.value} value={group.value}>
                    {group.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex-grow-1 me-3">
              <label className="me-2">Policy ARN:</label>
              <input
                type="text"
                value={policyArn}
                onChange={handlePolicyArnChange}
                className="w-75"
                placeholder="Enter the ARN of the policy to be detached"
              />
            </div>
            <div>
              <button onClick={detachPolicyFromGroup} className="btn btn-danger">Detach Policy from Group</button>
            </div>
          </div>
          <div className='pt-3'>
            {message && (
                  <Alert variant="success" dismissible onClose={() => setMessage('')}>
                {message}
              </Alert>
            )}
            {error && (
                  <Alert variant="danger" dismissible onClose={() => setError('')}>
                {error}
              </Alert>
            )}      
          </div>
       
        </div>

      </Collapse>
    </div>
  );
};

export default DetachPoliGrp;
