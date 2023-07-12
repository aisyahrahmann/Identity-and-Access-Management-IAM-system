
import Spinner from 'react-bootstrap/Spinner';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import DataTable from 'react-data-table-component';
import './DeleteUser.css';
import React, { useState, useEffect } from 'react';
import {Modal} from 'react-bootstrap';

import {
  IAMClient,
  ListGroupsCommand,
  GetGroupCommand,
  ListGroupPoliciesCommand,
  ListAttachedGroupPoliciesCommand,
  RemoveUserFromGroupCommand,
  DetachGroupPolicyCommand,
  DeleteGroupCommand,
} from '@aws-sdk/client-iam';

const accessKeyId = "YOUR_ACCESS_KEY";
const secretAccessKey = "YOUR_SECRET_ACCESS_KEY";
const region = "us-east-1"; // Replace with your desired AWS region

const iamClient = new IAMClient({
  region,
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
});

const GroupTable = () => {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showDeleteToast, setShowDeleteToast] = useState(false);
  const [showDeleteConfirmation,setShowDeleteConfirmation] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await iamClient.send(new ListGroupsCommand({}));
        const groupsWithDetails = await fetchGroupDetails(data.Groups);
        setGroups(groupsWithDetails);
      } catch (err) {
        console.log(err);
        setError('Error retrieving groups');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const fetchGroupDetails = async (groups) => {
    const groupsWithDetails = [];

    for (const group of groups) {
      const groupDetails = {
        GroupName: group.GroupName,
        CreationTime: new Date(group.CreateDate).toLocaleString(),
        Users: [],
        AttachedPolicies: [], // New property to store attached policies
      };

      try {
        const groupData = await iamClient.send(new GetGroupCommand({
          GroupName: group.GroupName,
        }));

        if (groupData.Users) {
          groupDetails.Users = groupData.Users.map(user =>user.UserName);
        }

        const groupPoliciesData = await iamClient.send(new ListGroupPoliciesCommand({
          GroupName: group.GroupName,
        }));

        const attachedPoliciesData = await iamClient.send(new ListAttachedGroupPoliciesCommand({
          GroupName: group.GroupName,
        }));

        groupDetails.AttachedPolicies = [
          ...groupPoliciesData.PolicyNames,
          ...attachedPoliciesData.AttachedPolicies.map(policy => policy.PolicyName)
        ];

        groupsWithDetails.push(groupDetails);
      } catch (err) {
        console.log('Error retrieving group details:', err);
      }
    }

    return groupsWithDetails;
  };

  const handleDeleteGroup = async (groupName) => {
    setShowDeleteConfirmation(true);
    setSelectedGroup(groupName);
  };

  const confirmDeleteGroup = async () => {
    try {
      // Check if the group exists
      const groupExists = groups.find((group) => group.GroupName === selectedGroup);
  
      if (!groupExists) {
        setError(`Group "${selectedGroup}" not found`);
        return;
      }
  
      // Get the list of users in the group
      const groupData = await iamClient.send(new GetGroupCommand({
        GroupName: selectedGroup,
      }));
  
      const users = groupData.Users || [];
  
      // Create an array of promises for removing users from the group
      const userPromises = users.map((user) => {
        return iamClient.send(new RemoveUserFromGroupCommand({
          GroupName: selectedGroup,
          UserName: user.UserName,
        }));
      });
  
      // Detach policies from the group
      const attachedPoliciesData = await iamClient.send(new ListAttachedGroupPoliciesCommand({
        GroupName: selectedGroup,
      }));
  
      // Create an array of promises for detaching policies from the group
      const policyPromises = attachedPoliciesData.AttachedPolicies.map((policy) => {
        return iamClient.send(new DetachGroupPolicyCommand({
          GroupName: selectedGroup,
          PolicyArn: policy.PolicyArn,
        }));
      });
  
      // Wait for all promises to resolve
      await Promise.all([...userPromises, ...policyPromises]);
      // Delete the group
      await iamClient.send(new DeleteGroupCommand({ GroupName: selectedGroup }));
  
      setGroups((prevGroups) => prevGroups.filter((group) => group.GroupName !== selectedGroup));
      setSuccessMessage(`Group "${selectedGroup}" deleted successfully`);
      setShowDeleteConfirmation(false);
      setShowDeleteToast(true);
    } catch (err) {
      setError('Error deleting group:', err);
    }
  };
  
  
  

  const columns = [
    {
      name: 'Group Name',
      selector: (row) => row.GroupName,
      sortable: true,
    },
    {
      name: 'Creation Time',
      selector: (row) => row.CreationTime,
      sortable: true,
    },
    {
      name: 'User Count',
      selector: (row) => row.Users.join(', '),
      sortable: true,
    },
    {
      name: 'Attached Policies',
      selector: (row) => row.AttachedPolicies.join(', '), // Convert the array to a comma-separated string
      sortable: true,
      wrap: true,
    },
    {
      name: '',
      cell: (row) => (
        <Button className="ms-2" variant="danger" onClick={() => handleDeleteGroup(row.GroupName)}>
          <DeleteIcon />
        </Button>
      ),
      button: true,
    },
  ];

  return (
    <div className="list-iam-users-container">
            {loading ? (
        <Spinner animation="grow" variant="dark" />
      ) : error ? (
        <Alert variant="danger">Error while loading data</Alert>
      ) : (
        <DataTable
          className="container mb-0"
          columns={columns}
          data={groups}
          fixedHeader
          pagination
        />
      )}
         <div className="list-iam-users-container">
          <Modal show={showDeleteConfirmation} onHide={() => setShowDeleteConfirmation(false)}>
            <Modal.Header closeButton closeVariant="white" className="text-bg-warning">
              <Modal.Title>Delete Group</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <p>You might delete all the data of the group {selectedGroup} such as the users and policies assigned.</p>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="danger" onClick={confirmDeleteGroup}>
                Confirm Delete
              </Button>
              <Button variant="secondary" onClick={() => setShowDeleteConfirmation(false)}>
                Cancel
              </Button>
            </Modal.Footer>
          </Modal>

          <Modal show={showDeleteToast} onHide={() => setShowDeleteToast(false)}>
            <Modal.Header closeButton closeVariant="white" className="text-bg-warning">
              <Modal.Title>Delete Group</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <p>{successMessage}</p>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowDeleteToast(false)}>
                Close
              </Button>
            </Modal.Footer>
          </Modal>
          </div>

    </div>
  );
};

export default GroupTable;
