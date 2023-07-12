import React, { useState, useEffect } from 'react';
import AWS from 'aws-sdk';
import DataTable from 'react-data-table-component';
import { getUser} from '../service/AuthService';

const S3UserPage = () => {
  
  const [bucketList, setBucketList] = useState([]);
  const [selectedBucket, setSelectedBucket] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    // Configure AWS SDK
    const user = getUser();
    const accessKeyId=user.accessKeyId;
    const secretAccessKey=user.secretAccessKey;

    AWS.config.update({
      region: 'us-east-1',
      accessKeyId: accessKeyId,
      secretAccessKey: secretAccessKey,
    });

    // Create S3 service object
    const s3 = new AWS.S3();

    // List existing buckets
    s3.listBuckets({}, (err, data) => {
      if (err) {
        console.error('Error listing buckets:', err);
        setErrorMessage(err.message); // Update the error message state
      } else {
        setBucketList(data.Buckets.map((bucket) => bucket.Name));
      }
    });
  }, []);

  const handleBucketChange = (event) => {
    setSelectedBucket(event.target.value);
  };

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = () => {
    if (selectedBucket && selectedFile) {
      setUploading(true);

      const user = getUser();
      const accessKeyId=user.accessKeyId;
      const secretAccessKey=user.secretAccessKey;
      // Configure AWS SDK
      AWS.config.update({
        region: 'us-east-1',
        accessKeyId: accessKeyId,
        secretAccessKey: secretAccessKey,
      });

      // Create S3 service object
      const s3 = new AWS.S3();

      // Upload file to the selected bucket
      const params = {
        Bucket: selectedBucket,
        Key: selectedFile.name,
        Body: selectedFile,
      };

      s3.upload(params, (err, data) => {
        if (err) {
          console.error('Error uploading file:', err);
          setErrorMessage(err.message); // Update the error message state
        } else {
          console.log('File uploaded successfully:', data);
        }
        setUploading(false);
      });
    }
  };

  const columns = [
    {
      name: 'Bucket Name',
      selector: (row) => row.bucketName,
      sortable: true,
    },
  ];
  return (
    <div>
      <div className="border">
        <div className="m-4">
          <h3>List of Buckets</h3>
          <DataTable
            className="container mb-0"
            columns={columns}
            data={bucketList.map((bucketName) => ({ bucketName }))}
            fixedHeader
            pagination
          />
        </div>
      </div>

      {/* <div className="border">
        <div className="m-4">
          <h3>Upload Object</h3>
          <div className="form-group">
            <label htmlFor="bucketSelect">Select Bucket:</label>
            <select
              id="bucketSelect"
              className="form-control"
              value={selectedBucket}
              onChange={handleBucketChange}
            >
              <option value="">-- Select a bucket --</option>
              {bucketList.map((bucketName) => (
                <option key={bucketName} value={bucketName}>
                  {bucketName}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="fileUpload">Select File:</label>
            <input
              type="file"
              id="fileUpload"
              className="form-control"
              onChange={handleFileChange}
            />
          </div>

         <button
            onClick={handleUpload}
            disabled={!selectedBucket || !selectedFile || uploading}
            className="btn btn-primary"
          >
            {uploading ? 'Uploading...' : 'Upload'}
          </button>

          {errorMessage && (
            <div className="error-message mt-3">Error: {errorMessage}</div>
          )}
        </div>
      </div> */}
    </div>
);
};

export default S3UserPage;
