import { useState, useEffect } from 'react';
import { IAMClient, ListGroupsCommand,ListGroupsForUserCommand, ListUsersCommand, RemoveUserFromGroupCommand } from '@aws-sdk/client-iam';

const RemoveUserFromGroup = () => {
  const [users, setUsers] = useState([]); // List of IAM Users
  const [groups, setGroups] = useState([]); // List of IAM Groups
  const [selectedUser, setSelectedUser] = useState(''); // Selected IAM User
  const [selectedGroup, setSelectedGroup] = useState(''); // Selected IAM Group
  const [message, setMessage] = useState('');

  const handleUserChange = (e) => {
    setSelectedUser(e.target.value);
  };

  const handleGroupChange = (e) => {
    setSelectedGroup(e.target.value);
  };

  const removeUserFromGroup = async () => {
    try {
      const iamClient = new IAMClient({
        region: 'us-east-1', // Replace with your desired AWS region
        credentials: {
            accessKeyId: 'YOUR_ACCESS_KEY',
    secretAccessKey: 'YOUR_SECRET_ACCESS_KEY',
        },
      });

      // Validate if the selected user is a member of the selected group
      const userGroups = await iamClient.send(new ListGroupsForUserCommand({ UserName: selectedUser }));
      const isUserInGroup = userGroups.Groups.some((group) => group.GroupName === selectedGroup);

      if (!isUserInGroup) {
        setMessage(`User ${selectedUser} is not a member of group ${selectedGroup}`);
        return;
      }

      // Remove the selected IAM User from the selected IAM Group
      await iamClient.send(new RemoveUserFromGroupCommand({ GroupName: selectedGroup, UserName: selectedUser }));

      setMessage(`Successfully removed user ${selectedUser} from group ${selectedGroup}`);
    } catch (err) {
      console.error(err);
      setMessage('Error removing user from group');
    }
  };

  // Fetch the list of IAM Users and Groups
  useEffect(() => {
    const fetchUsersAndGroups = async () => {
      try {
        const iamClient = new IAMClient({
          region: 'us-east-1', // Replace with your desired AWS region
          credentials: {
            accessKeyId: 'YOUR_ACCESS_KEY',
    secretAccessKey: 'YOUR_SECRET_ACCESS_KEY',
          },
        });

        // Fetch the list of IAM Users
        const { Users } = await iamClient.send(new ListUsersCommand({}));

        // Fetch the list of IAM Groups
        const { Groups } = await iamClient.send(new ListGroupsCommand({}));

        // Map the fetched users and groups to the required format
        const formattedUsers = Users.map((user) => ({
          value: user.UserName,
          label: user.UserName,
        }));

        const formattedGroups = Groups.map((group) => ({
          value: group.GroupName,
          label: group.GroupName,
        }));

        setUsers(formattedUsers);
        setGroups(formattedGroups);
      } catch (err) {
        console.error(err);
        setMessage('Error fetching users and groups');
      }
    };

    fetchUsersAndGroups();
  }, []);

  return (
<div className="m-3 my-4">
<h5 className="me-3">Remove user from group</h5>
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
    <div>
      <button onClick={removeUserFromGroup} className="btn btn-danger">Remove User from Group</button>
    </div>
  </div>
  {message && <div>{message}</div>}
</div>

  );
};

export default RemoveUserFromGroup;
