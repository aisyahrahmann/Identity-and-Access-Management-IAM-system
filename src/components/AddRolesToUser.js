import React, { useState, useEffect } from 'react';
import {
  IAMClient,
  ListUsersCommand,
  AttachUserPolicyCommand,
} from '@aws-sdk/client-iam';

const AssignRoleToUser = () => {
  const [users, setUsers] = useState([]); // List of IAM Users
  const [selectedUser, setSelectedUser] = useState(''); // Selected IAM User
  const [roleArn, setRoleArn] = useState(''); // ARN of the role to be attached
  const [message, setMessage] = useState('');

  const handleUserChange = (e) => {
    setSelectedUser(e.target.value);
  };

  const handleRoleArnChange = (e) => {
    setRoleArn(e.target.value);
  };

  const assignRoleToUser = async () => {
    try {
      const iamClient = new IAMClient({
        region: 'us-east-1', // Replace with your desired AWS region
        credentials: {
          accessKeyId: 'AKIA5SFSGTHHY56JRHWV',
          secretAccessKey: 'knOSZ3ldNK/5a9e8/nsaZTmgBM9Cqtk7DXnZu78B',
        },
      });

      // Attach the role to the selected IAM User
      await iamClient.send(
        new AttachUserPolicyCommand({
          UserName: selectedUser,
          PolicyArn: roleArn,
        })
      );

      setMessage(`Successfully attached role ${roleArn} to user ${selectedUser}`);
    } catch (err) {
      console.error(err);
      setMessage('Error attaching role to user');
    }
  };

  // Fetch the list of IAM Users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const iamClient = new IAMClient({
          region: 'us-east-1', // Replace with your desired AWS region
          credentials: {
            accessKeyId: 'AKIA5SFSGTHHY56JRHWV',
            secretAccessKey: 'knOSZ3ldNK/5a9e8/nsaZTmgBM9Cqtk7DXnZu78B',
          },
        });

        const { Users } = await iamClient.send(new ListUsersCommand({}));

        const formattedUsers = Users.map((user) => ({
          value: user.UserName,
          label: user.UserName,
        }));

        setUsers(formattedUsers);
      } catch (err) {
        console.error(err);
        setMessage('Error fetching users');
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="m-3 my-4">
      <h5>Attach role to user</h5>
      <div className="d-flex align-items-center">
        <div className="flex-grow-1 me-3">
          <label className="me-2">Select IAM User:</label>
          <select value={selectedUser} onChange={handleUserChange}>
            <option value="">Select User</option>
            {users.map((user) => (
              <option key={user.value} value={user.value}>
                {user.label}
              </option>
            ))}
          </select>
        </div>
        <div className="flex-grow-1 me-3">
          <label className="me-2">Role ARN:</label>
          <input
            type="text"
            value={roleArn}
            onChange={handleRoleArnChange}
            className="w-75" // CSS class to adjust the width of the input box
            placeholder="Enter the ARN of the role to be attached"
          />
        </div>
        <div>
          <button onClick={assignRoleToUser} className="btn btn-primary">
            Attach Role to User
          </button>
        </div>
      </div>
      {message && <div>{message}</div>}
    </div>
  );
};

export default AssignRoleToUser;
