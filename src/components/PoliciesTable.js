import DataTable from 'react-data-table-component';
import { useState, useEffect } from 'react';
import { IAMClient, ListPoliciesCommand } from '@aws-sdk/client-iam';
import { Spinner, Alert } from 'react-bootstrap';

const PoliciesTable = () => {
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchPolicies = async () => {
      try {
        const accessKeyId = 'YOUR_ACCESS_KEY';
        const secretAccessKey = 'YOUR_SECRET_ACCESS_KEY';
        const region = 'us-east-1'; // Replace with your desired AWS region

        // Initialize IAM client with the provided credentials
        const iamClient = new IAMClient({
          region,
          credentials: {
            accessKeyId,
            secretAccessKey,
          },
        });

        // Fetch the list of policies
        const { Policies } = await iamClient.send(new ListPoliciesCommand({}));

        // Map the fetched policies to the required format
        const formattedPolicies = Policies.map((policy) => ({
          id: policy.PolicyId,
          name: policy.PolicyName,
          arn: policy.Arn,
        }));

        setPolicies(formattedPolicies);
      } catch (err) {
        console.log(err);
        setError('Error retrieving policies');
      } finally {
        setLoading(false);
      }
    };

    fetchPolicies();
  }, []);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredPolicies = policies.filter((policy) =>
    policy.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
    {
      name: 'Policy Name',
      selector: (row) => row.name,
      sortable: true,
    },
    {
      name: 'Policy ARN',
      selector: (row) => row.arn,
      sortable: true,
      cell: (row) => <div style={{ whiteSpace: 'pre-wrap' }}>{row.arn}</div>,
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
        <div className='shadow-sm p-3 mb-5 bg-body rounded border'>
          <input
            type="text"
            placeholder="Search by policy name"
            value={searchTerm}
            onChange={handleSearch}
            style={{ marginLeft: '50px', marginBottom: '20px', width: '90%' }}
          />
          
          <DataTable
            className="container mb-0"
            columns={columns}
            data={filteredPolicies}
            fixedHeader
            pagination
          />
          </div>
        </>
      )}
    </>
  );
};

export default PoliciesTable;
