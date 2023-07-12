import React, { useState, useEffect } from 'react';
import {
  IAMClient,
  ListUsersCommand,
  DetachUserPolicyCommand,
} from '@aws-sdk/client-iam';

const DetachRoleFromUser = () => {
  const [users, setUsers] = useState([]); // List of IAM Users
  const [selectedUser, setSelectedUser] = useState(''); // Selected IAM User
  const [roleArn, setRoleArn] = useState(''); // ARN of the role to be detached
  const [message, setMessage] = useState('');

  const handleUserChange = (e) => {
    setSelectedUser(e.target.value);
  };

  const handleRoleArnChange = (e) => {
    setRoleArn(e.target.value);
  };

  const detachRoleFromUser = async () => {
    try {
      const iamClient = new IAMClient({
        region: 'us-east-1', // Replace with your desired AWS region
        credentials: {
          accessKeyId: 'YOUR_ACCESS_KEY',
    secretAccessKey: 'YOUR_SECRET_ACCESS_KEY',
        },
      });

      // Detach the role from the selected IAM User
      await iamClient.send(
        new DetachUserPolicyCommand({
          UserName: selectedUser,
          PolicyArn: roleArn,
        })
      );

      setMessage(`Successfully detached role ${roleArn} from user ${selectedUser}`);
    } catch (err) {
      console.error(err);
      setMessage('Error detaching role from user');
    }
  };

  // Fetch the list of IAM Users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const iamClient = new IAMClient({
          region: 'us-east-1', // Replace with your desired AWS region
          credentials: {
           accessKeyId: 'YOUR_ACCESS_KEY',
    secretAccessKey: 'YOUR_SECRET_ACCESS_KEY',
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
      <h5>Detach role from user</h5>
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
            placeholder="Enter the ARN of the role to be detached"
          />
        </div>
        <div>
          <button onClick={detachRoleFromUser} className="btn btn-danger">
            Detach Role from User
          </button>
        </div>
      </div>
      {message && <div>{message}</div>}
    </div>
  );
};

export default DetachRoleFromUser;
