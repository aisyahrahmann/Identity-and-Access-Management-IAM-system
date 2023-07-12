

import React, { useState, useEffect } from 'react';
import { IAMClient, ListGroupsCommand, AttachGroupPolicyCommand, ListAttachedGroupPoliciesCommand} from '@aws-sdk/client-iam';
import { Collapse } from 'react-bootstrap';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import Alert from 'react-bootstrap/Alert';

const AssignUserToGroup = () => {
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState('');
  const [policyArn, setPolicyArn] = useState('');
  const [message, setMessage] = useState('');
  const [Errmessage, setErrMessage] = useState('');
  const [isCollapsed, setIsCollapsed] = useState(true); // Collapsible state

  const handleGroupChange = (e) => {
    setSelectedGroup(e.target.value);
  };

  const handlePolicyArnChange = (e) => {
    setPolicyArn(e.target.value);
  };

  const assignPolicyToGroup = async () => {
    try {
      const iamClient = new IAMClient({
        region: 'us-east-1',
        credentials: {
          accessKeyId: 'YOUR_ACCESS_KEY',
          secretAccessKey: 'YOUR_SECRET_ACCESS_KEY',
        },
      });

      const { AttachedPolicies } = await iamClient.send(new ListAttachedGroupPoliciesCommand({
        GroupName: selectedGroup,
      }));
  
      const isPolicyAttached = AttachedPolicies.find(policy => policy.PolicyArn === policyArn);
  
      if (isPolicyAttached) {
        setErrMessage(`Policy ${policyArn} is already attached to group ${selectedGroup}`);
        return;
      }

      await iamClient.send(new AttachGroupPolicyCommand({
        GroupName: selectedGroup,
        PolicyArn: policyArn,
      }));

      setMessage(`Successfully attached policy ${policyArn} to group ${selectedGroup}`);
    } catch (err) {
      console.error(err);
      setErrMessage('Error attaching policy to group');
    }
  };

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const iamClient = new IAMClient({
          region: 'us-east-1',
          credentials: {
            accessKeyId: 'YOUR_ACCESS_KEY',
            secretAccessKey: 'YOUR_SECRET_ACCESS_KEY',
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
        setMessage('Error fetching groups');
      }
    };

    fetchGroups();
  }, []);

  const handleToggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className="m-3 my-4">
      <div className="d-flex align-items-center">
        <h5 style={{ cursor: 'pointer', flex: '1' }}>Attach policy to group</h5>
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
                placeholder="Enter the ARN of the policy to be attached"
              />
            </div>
            <div>
              <button onClick={assignPolicyToGroup} className="btn btn-primary">
                Attach Policy to Group
              </button>
            </div>
          </div>
          <div className='pt-3'>
            {message && (
                  <Alert variant="success" dismissible onClose={() => setMessage('')}>
                {message}
              </Alert>
            )}
            {Errmessage && (
                  <Alert variant="danger" dismissible onClose={() => setErrMessage('')}>
                {Errmessage}
              </Alert>
            )}      
          </div>
          
        </div>
      </Collapse>
    </div>
  );
};

export default AssignUserToGroup;
