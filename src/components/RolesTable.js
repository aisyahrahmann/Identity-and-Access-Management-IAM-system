import DataTable from 'react-data-table-component';
import { useState, useEffect } from 'react';
import { IAMClient, ListRolesCommand } from '@aws-sdk/client-iam';
import { Spinner, Alert } from 'react-bootstrap';

const RolesTable = () => {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const accessKeyId = 'AKIA5SFSGTHHY56JRHWV';
        const secretAccessKey = 'knOSZ3ldNK/5a9e8/nsaZTmgBM9Cqtk7DXnZu78B';
        const region = 'us-east-1'; // Replace with your desired AWS region

        // Initialize IAM client with the provided credentials
        const iamClient = new IAMClient({
          region,
          credentials: {
            accessKeyId,
            secretAccessKey,
          },
        });

        // Fetch the list of roles
        const { Roles } = await iamClient.send(new ListRolesCommand({}));

        // Map the fetched roles to the required format
        const formattedRoles = Roles.map((role) => ({
          id: role.RoleId,
          name: role.RoleName,
          arn: role.Arn,
        }));

        setRoles(formattedRoles);
      } catch (err) {
        console.log(err);
        setError('Error retrieving roles');
      } finally {
        setLoading(false);
      }
    };

    fetchRoles();
  }, []);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredRoles = roles.filter((role) =>
    role.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
    {
      name: 'Role Name',
      selector: (row) => row.name,
      sortable: true,
    },
    {
      name: 'Role ARN',
      selector: (row) => row.arn,
      sortable: true,
      cell: (row) => <div>{row.arn}</div>,
    },
  ];

  return (
    <>
      {loading ? (
        <Spinner animation="grow" variant="dark" />
      ) : error ? (
        <Alert variant="danger">{error}</Alert>
      ) : (
        <>
          <input
            type="text"
            placeholder="Search by role name"
            value={searchTerm}
            onChange={handleSearch}
            style={{ marginLeft: '50px', marginBottom: '20px', width: '90%' }}
          />
          <DataTable
            className="container mb-0"
            columns={columns}
            data={filteredRoles}
            fixedHeader
            pagination
          />
        </>
      )}
    </>
  );
};

export default RolesTable;
