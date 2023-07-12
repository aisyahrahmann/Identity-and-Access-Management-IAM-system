import React, { useState, useEffect } from 'react';
import AWS from 'aws-sdk';
import DataTable from 'react-data-table-component';
import { getUser} from '../service/AuthService';

const DynamoDBTableCreation = () => {
  
  // console.log("user", user);
  const [tableName, setTableName] = useState('');
  const [readCapacityUnits, setReadCapacityUnits] = useState(5);
  const [writeCapacityUnits, setWriteCapacityUnits] = useState(5);
  const [isCreatingTable, setIsCreatingTable] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [tableList, setTableList] = useState([]);

  const handleTableNameChange = (event) => {
    setTableName(event.target.value);
  };

  const handleReadCapacityChange = (event) => {
    setReadCapacityUnits(Number(event.target.value));
  };

  const handleWriteCapacityChange = (event) => {
    setWriteCapacityUnits(Number(event.target.value));
  };

  const handleCreateTable = () => {
    setIsCreatingTable(true);
    const user = getUser();
    const accessKeyId=user.accessKeyId;
    const secretAccessKey=user.secretAccessKey;

    // Configure AWS SDK
    AWS.config.update({
      region: 'us-east-1',
      accessKeyId: accessKeyId,
      secretAccessKey: secretAccessKey,
    });

    // Create DynamoDB service object
    const dynamoDB = new AWS.DynamoDB();

    // Define table parameters
    const tableParams = {
      TableName: tableName,
      AttributeDefinitions: [
        { AttributeName: 'id', AttributeType: 'N' }, // Example attribute
      ],
      KeySchema: [
        { AttributeName: 'id', KeyType: 'HASH' }, // Example primary key
      ],
      ProvisionedThroughput: {
        ReadCapacityUnits: readCapacityUnits,
        WriteCapacityUnits: writeCapacityUnits,
      },
    };

    // Create the table
    dynamoDB.createTable(tableParams, (err, data) => {
      if (err) {
        console.error('Error creating table:', err);
        setErrorMessage(err.message); // Update the error message state
      } else {
        console.log('Table created successfully:', data);
      }
      setIsCreatingTable(false);
    });
  };

  useEffect(() => {
    const user = getUser();
    const accessKeyId=user.accessKeyId;
    const secretAccessKey=user.secretAccessKey;

    console.log("testing", accessKeyId);
    // Configure AWS SDK
    AWS.config.update({
      region: 'us-east-1',
      accessKeyId: accessKeyId,
      secretAccessKey: secretAccessKey,
    });

    // Create DynamoDB service object
    const dynamoDB = new AWS.DynamoDB();

    // Describe existing tables
    dynamoDB.listTables({}, (err, data) => {
      if (err) {
        console.error('Error listing tables:', err);
        setErrorMessage(err.message); // Update the error message state
      } else {
        setTableList(data.TableNames);
      }
    });
  }, []);

  const columns = [
    {
      name: 'Table Name',
      selector: row => row.tableName,
      sortable: true
    }
  ];

  return (
    <div>
    <div className="border">
      <div className="m-4">
        <h3>Create DynamoDB Table</h3>
        <div className="form-group">
          <label htmlFor="tableName">Table Name:</label>
          <input
            type="text"
            className="form-control"
            id="tableName"
            value={tableName}
            onChange={handleTableNameChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="readCapacity">Read Capacity Units:</label>
          <input
            type="number"
            className="form-control"
            id="readCapacity"
            value={readCapacityUnits}
            onChange={handleReadCapacityChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="writeCapacity">Write Capacity Units:</label>
          <input
            type="number"
            className="form-control"
            id="writeCapacity"
            value={writeCapacityUnits}
            onChange={handleWriteCapacityChange}
          />
        </div>
        <button
          onClick={handleCreateTable}
          disabled={isCreatingTable}
          className="btn btn-primary"
        >
          {isCreatingTable ? 'Creating Table...' : 'Create Table'}
        </button>
  
        {errorMessage && (
          <div className="error-message mt-3">
            Error: {errorMessage}
          </div>
        )}
      </div>
    </div>
  
    <div className="border">
      <div className="m-4">
        <h3>List of Tables</h3>
        <DataTable
        className="container mb-0"
        columns={columns}
        data={tableList.map((tableName) => ({ tableName }))}
        fixedHeader
        pagination
      />
      </div>
    </div>
  </div>
  
  );
};

export default DynamoDBTableCreation;
