import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { IAMClient, ListUsersCommand } from '@aws-sdk/client-iam';
import { CloudTrailClient, LookupEventsCommand } from '@aws-sdk/client-cloudtrail';
import { Spinner, Alert } from 'react-bootstrap';

const iamClient = new IAMClient({
  region: 'us-east-1', // Replace with your desired AWS region
  credentials: {
    accessKeyId: 'AKIA5SFSGTHHY56JRHWV',
    secretAccessKey: 'knOSZ3ldNK/5a9e8/nsaZTmgBM9Cqtk7DXnZu78B',
  },
});

const cloudtrailClient = new CloudTrailClient({
  region: 'us-east-1', // Replace with your desired AWS region
  credentials: {
    accessKeyId: 'AKIA5SFSGTHHY56JRHWV',
    secretAccessKey: 'knOSZ3ldNK/5a9e8/nsaZTmgBM9Cqtk7DXnZu78B',
  },
});

const ActivitiesTable = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchIAMUsers = async () => {
    try {
      const { Users } = await iamClient.send(new ListUsersCommand({}));
       // Map the fetched users and groups to the required format
       const formattedUsers = Users.map((user) => ({
        value: user.UserName,
        label: user.UserName,
      }));
      setUsers(formattedUsers);
    } catch (err) {
      console.error('Error retrieving IAM users:', err);
      setError('Error retrieving IAM users');
    }
  };

  const fetchCloudTrailEvents = async (username) => {
    try {
      const params = {
        LookupAttributes: [
          {
            AttributeKey: 'Username',
            AttributeValue: username,
          },
        ],
      };

      const data = await cloudtrailClient.send(new LookupEventsCommand(params));
      const cloudTrailEvents = data.Events.map((event) => {
        const resourceNames = event.Resources?.map((resource) => resource.ResourceName);
        return {
          ...event,
          ResourceNames: resourceNames,
        };
      });

      setEvents(cloudTrailEvents);
      setLoading(false);
    } catch (err) {
      console.error('Error retrieving CloudTrail events:', err);
      setError('Error retrieving CloudTrail events');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIAMUsers();
  }, []);

  const handleUserChange = (event) => {
    setSelectedUser( event.target.value);
  };

  useEffect(() => {
    if (selectedUser) {
      fetchCloudTrailEvents(selectedUser);
    }
  }, [selectedUser]);

  const columns = [
    { name: 'Event Name', selector: (row) => row.EventName, sortable: true },
    { name: 'Event Source', selector: (row) => row.EventSource, sortable: true },
    {
      name: 'Event Time',
      selector: (row) => row.EventTime,
      sortable: true,
      cell: (row) => new Date(row.EventTime).toLocaleString(),
    },
    { name: 'Username', selector: (row) => row.Username, sortable: true },
    { name: 'Resource Name', selector: (row) => row.ResourceNames, sortable: true, cell: (row) => row.ResourceNames ? row.ResourceNames.join(', ') : '-' },
  ];

  const data = events.map((event) => ({
    ...event,
    ResourceNames: event.Resources ? event.Resources.map((resource) => resource.ResourceName) : [],
  }));

  return (
    <div className='shadow-sm p-3 mb-5 bg-body rounded border'>
      <h2>User's Activities</h2>
      <div className="container my-5">
        <label htmlFor="username">Select User:</label>
        <select value={selectedUser} onChange={handleUserChange}>
        <option value="">Select User</option>
        {users.map((user) => (
          <option key={user.value} value={user.value}>
            {user.label}
          </option>
        ))}
      </select>
      </div>
      {loading ? (
        <Spinner animation="grow" variant="dark" />
      ) : error ? (
        <Alert variant="danger">Error while loading data</Alert>
      ) : (
        <div className='border'>
          <div className='pt-5'>
            <DataTable
              className="container mb-0"
              columns={columns}
              data={data}
              noHeader
              pagination
              highlightOnHover
              striped
            />
          </div>
        </div>
     
    )}
    </div>
  );
};

export default ActivitiesTable;
