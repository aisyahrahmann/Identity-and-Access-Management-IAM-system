// //LATEST USERTABLE


// import React, { useState, useEffect } from 'react';
// import Button from 'react-bootstrap/Button';
// import { Spinner, Alert } from 'react-bootstrap';
// import DataTable from 'react-data-table-component';
// import DeleteIcon from '@mui/icons-material/Delete';
// import GroupAddIcon from '@mui/icons-material/GroupAdd';
// import GroupRemoveIcon from '@mui/icons-material/GroupRemove';
// import axios from "axios";
// import Toast from 'react-bootstrap/Toast';
// import './DeleteUser.css';
// import {
//   IAMClient,
//   ListUsersCommand,
//   RemoveUserFromGroupCommand,
//   DeleteUserCommand,
//   DeleteAccessKeyCommand,
//   ListAccessKeysCommand,
//   ListGroupsForUserCommand,
//   GetUserCommand,
//   AddUserToGroupCommand,
//   DeleteLoginProfileCommand,
//   ListGroupsCommand
// } from '@aws-sdk/client-iam';

// const accessKeyId = "AKIA5SFSGTHHY56JRHWV";
// const secretAccessKey = "knOSZ3ldNK/5a9e8/nsaZTmgBM9Cqtk7DXnZu78B";
// const region = "us-east-1"; // Replace with your desired AWS region

// const deleteAPIurl = "https://lopzszq3r3.execute-api.us-east-1.amazonaws.com/prod/delete";

// const iamClient = new IAMClient({
//   region,
//   credentials: {
//     accessKeyId,
//     secretAccessKey,
//   },
// });

// // function ListIAMUsers() {
// const ListIAMUsers = () =>{
//   const [users, setUsers] = useState([]);
//   const [groups, setGroups] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
//   const [deleteUserMessage, setDeleteUserMessage] = useState('');
//   const [showDeleteToast, setShowDeleteToast] = useState(false);
//   const [message, setMessage] = useState('');
//   const [selectedGroup, setSelectedGroup] = useState('');
//   const [showAssignForm, setShowAssignForm] = useState(false);
//   const [selectedUser, setSelectedUser] = useState('');
//   const [showRemoveForm, setShowRemoveForm] = useState(false);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const params = { MaxItems: 7 };
//         const data = await iamClient.send(new ListUsersCommand(params));

//         const usersWithDetails = await fetchUserDetails(data.Users);
//         setUsers(usersWithDetails);

//         const groupsData = await iamClient.send(new ListGroupsCommand({}));
//         setGroups(groupsData.Groups);
//       } catch (err) {
//         console.log(err);
//         setError('Error retrieving users');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, []);

  

//   const fetchUserDetails = async (users) => {
//     const usersWithDetails = [];

//     for (const user of users) {
//       const userDetails = {
//         UserName: user.UserName,
//         Arn: user.Arn,
//         AccessKeys: [],
//         Groups: [],
//       };

//       const accessKeysParams = {
//         UserName: user.UserName,
//       };

//       const groupsParams = {
//         UserName: user.UserName,
//       };

//       try {
//         const accessKeysData = await iamClient.send(new ListAccessKeysCommand(accessKeysParams));
//         userDetails.AccessKeys = accessKeysData.AccessKeyMetadata;

//         const groupsData = await iamClient.send(new ListGroupsForUserCommand(groupsParams));
//         userDetails.Groups = groupsData.Groups;

//         usersWithDetails.push(userDetails);
//       } catch (err) {
//         console.log('Error retrieving user details:', err);
//       }
//     }

//     return usersWithDetails;
//   };

//   const handleDeleteUser = async (userName) => {

//     const confirmation = window.confirm(`Are you sure you want to delete user ${userName}?`);

//     if (!confirmation) {
//       return;
//     }

//     try {

      
//       // Find the user to delete
//       const userToDelete = users.find((user) => user.UserName === userName);

//       if (!userToDelete) {
//         setError(`User "${userName}" not found`);
//         return;
//       }

//       // Delete groups for the user
//       if (userToDelete.Groups && userToDelete.Groups.length > 0) {
//         for (const group of userToDelete.Groups) {
//           await iamClient.send(new RemoveUserFromGroupCommand({ GroupName: group.GroupName, UserName: userName }));
//         }
//       }

//       // Delete access keys for the user
//       if (userToDelete.AccessKeys && userToDelete.AccessKeys.length > 0) {
//         for (const accessKey of userToDelete.AccessKeys) {
//           await iamClient.send(new DeleteAccessKeyCommand({ AccessKeyId: accessKey.AccessKeyId, UserName: userName }));
//         }
//       }

//       // Delete login profile for the user
//       const userDetails = await iamClient.send(new GetUserCommand({ UserName: userName }));
//       if (userDetails.LoginProfile) {
//         // Delete the login profile
//         await iamClient.send(new DeleteLoginProfileCommand({ UserName: userName }));
//       }

//       // Delete the user
//       const params = {
//         UserName: userName,
//       };
    
//       const requestBody = {
//         username: userName,
//       }


//       // Delete the user
//       axios.delete(deleteAPIurl, requestBody, {
//         headers: {
//           'x-api-key': 'hgy7XNweFw5F3cu28m2048PjpgdfSlJI1kOle6im',
          
//         }
//       })
//       .then(response => {
//         console.log('User data stored in the database:', response.data);
//       })
//       .catch(error => {
//         console.error('Error storing user data:', error);
//       });
//       await iamClient.send(new DeleteUserCommand(params));
//       setUsers(users.filter((user) => user.UserName !== userName));
//       setDeleteUserMessage(`Successfully deleted user ${userName}`);
//       setShowDeleteToast(true);
      
//     } catch (err) {
//       console.log(err);
//       setError('Error deleting user');
//     }
//   };

//   const handleOpenAssignForm = (userName) => {
//     setShowAssignForm(true);
//     setSelectedUser(userName);
//   };

//   const handleOpenRemoveForm = (userName) => {
//     setShowRemoveForm(true);
//     setSelectedUser(userName);
//   };

//   const handleAttachGroup = async () => {
//     try {
//       // Find the user and group to assign
//       const userToAssign = users.find((user) => user.UserName === selectedUser);
//       const { Groups } = await iamClient.send(new ListGroupsCommand({}));

//       if (!userToAssign) {
//         setMessage(`User "${selectedUser}" not found`);
//         return;
//       }

//       if (!selectedGroup) {
//         setMessage('Please select a group');
//         return;
//       }

//       const groupExists = Groups.some((group) => group.GroupName === selectedGroup);
//       if (!groupExists) {
//         setMessage(`Group "${selectedGroup}" does not exist`);
//         return;
//       }

//       await iamClient.send(new AddUserToGroupCommand({ GroupName: selectedGroup, UserName: selectedUser }));
//       setMessage(`Successfully assigned user ${selectedUser} to group ${selectedGroup}`);
//       setShowAssignForm(false);
//     } catch (err) {
//       console.log(err);
//       setMessage('Error assigning user to group');
//     }
//   };

//   const handleRemoveUserFromGroup = async () => {
//     try {
//       // Find the user and group to remove
//       const userToRemove = users.find((user) => user.UserName === selectedUser);
//       const { Groups } = await iamClient.send(new ListGroupsCommand({}));

//       if (!userToRemove) {
//         setMessage(`User "${selectedUser}" not found`);
//         return;
//       }

//       if (!selectedGroup) {
//         setMessage('Please select a group');
//         return;
//       }

//       const groupExists = Groups.some((group) => group.GroupName === selectedGroup);
//       if (!groupExists) {
//         setMessage(`Group "${selectedGroup}" does not exist`);
//         return;
//       }

//       const isUserInGroup = userToRemove.Groups.some((group) => group.GroupName === selectedGroup);
//       if (!isUserInGroup) {
//         setMessage(`User "${selectedUser}" is not a member of group "${selectedGroup}"`);
//         return;
//       }

//       await iamClient.send(new RemoveUserFromGroupCommand({ GroupName: selectedGroup, UserName: selectedUser }));
//       setMessage(`Successfully removed user ${selectedUser} from group ${selectedGroup}`);
//       setShowRemoveForm(false);
//     } catch (err) {
//       console.log(err);
//       setMessage('Error removing user from group');
//     }
//   };

//   const columns = [
//     {
//       name: 'User Name',
//       selector: (row) => row.UserName,
//       sortable: true,
//     },
//     {
//       name: 'Groups',
//         selector: (row) => row.Groups.length,
//         sortable: true,
//         cell: (row) => (row.Groups.length > 0 ? row.Groups.map((group) => group.GroupName).join(', ') : 'No groups'),
//     },
//     {
//       name: 'ARN',
//       selector: (row) => row.Arn,
//       sortable: false,
//       wrap: true,
//       width:'400px'
//     },
//     {
//       name: 'Access Keys',
//       selector: (row) => row.AccessKeys.length,
//       sortable: true,
//       cell: (row) =>
//         row.AccessKeys.length > 0 ? row.AccessKeys.map((accessKey) => accessKey.AccessKeyId).join(', ') : 'No access keys',
//     },
//     {
//       name: '',
//       sortable: false,
//       cell: (row) => (
//         <>
//           <Button className="ms-2" variant="success" onClick={() => handleOpenAssignForm(row.UserName)}>
//             <GroupAddIcon />
//           </Button>
//           <Button className="ms-2" variant="warning" onClick={() => handleOpenRemoveForm(row.UserName)}>
//             <GroupRemoveIcon />
//           </Button>
//           <Button className="ms-2" variant="danger" onClick={() => handleDeleteUser(row.UserName)}>
//             <DeleteIcon />
//           </Button>
          
//         </>
//       ),
//     },
//   ];

//   return (
//         <div className="list-iam-users-container">
//           {loading ? (
//             <Spinner animation="grow" variant="dark" />
//           ) : error ? (
//             <Alert variant="danger">Error while loading data</Alert>
//           ) : (
//             <DataTable className="container mb-0" columns={columns} data={users} fixedHeader pagination />
//           )}
//           {showDeleteToast && (
//             <div className="delete-toast-overlay">
//               <Toast
//                 show={true}
//                 onClose={() => setShowDeleteToast(false)}
//                 className="delete-toast"
//                 style={{ zIndex: 9999 }}
//               >
//                 <Toast.Header>
//                   <strong className="me-auto">Delete User</strong>
//                 </Toast.Header>
//                 <Toast.Body>{deleteUserMessage}</Toast.Body>
//               </Toast>
//             </div>
//           )}
//           {showAssignForm && (
//                 <div className="assign-overlay">
//                   <div className="assign-form">
//                     <h4>Assign User to Group</h4>
//                     <select
//                       className="form-select"
//                       value={selectedGroup}
//                       onChange={(e) => setSelectedGroup(e.target.value)}
//                     >
//                       <option value="">Select a group</option>
//                       {groups.map((group) => (
//                         <option key={group.GroupName} value={group.GroupName}>
//                           {group.GroupName}
//                         </option>
//                       ))}
//                     </select>
//                     <span className="close-icon" onClick={() => setShowAssignForm(false)}>
//                       &times;
//                     </span>
//                     <div className="assign-form-buttons">
//                       <Button className="ms-2" variant="primary" onClick={handleAttachGroup}>
//                         Assign
//                       </Button>
//                       <Button
//                         className="ms-2"
//                         variant="secondary"
//                         onClick={() => setShowAssignForm(false)}
//                       >
//                         Cancel
//                       </Button>
//                     </div>
//                     {message && (
//                       <div className="assign-form-message">
//                         <Alert variant="success">{message}</Alert>
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               )}
              
              
//               {showRemoveForm && (
//                   <div className='assign-overlay'>
//                     <div className="assign-form">
//                       <h4>Remove User from Group</h4>
//                       <select
//                         className="form-select"
//                         value={selectedGroup}
//                         onChange={(e) => setSelectedGroup(e.target.value)}
//                       >
//                         <option value="">Select a group</option>
//                         {groups.map((group) => (
//                           <option key={group.GroupName} value={group.GroupName}>
//                             {group.GroupName}
//                           </option>
//                         ))}
//                       </select>
//                       <span className="close-icon" onClick={() => setShowRemoveForm(false)}>
//                         &times;
//                       </span>
//                       <div className="assign-form-buttons">
//                         <Button className="ms-2" variant="primary" onClick={handleRemoveUserFromGroup}>
//                           Remove
//                         </Button>
//                         <Button
//                           className="ms-2"
//                           variant="secondary"
//                           onClick={() => setShowRemoveForm(false)}
//                         >
//                           Cancel
//                         </Button>
//                       </div>
//                       {message && (
//                         <div className="assign-form-message">
//                           <Alert variant="success">{message}</Alert>
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 )}

//                 {!showAssignForm && message && (
//                   <div className="assign-overlay">
//                     <div className="assign-form">
//                     <span className="close-icon" onClick={() => setMessage('')}>&times;</span>
//                     <div className='pt-5'>
//                       <Alert variant="success">
//                         {message && <div>{message}</div>}
//                       </Alert>
//                     </div>
//                     </div>
//                   </div>
//                 )}

//                 {!showRemoveForm && message && (
//                   <div className="assign-overlay">
//                     <div className="assign-form">
//                     <span className="close-icon" onClick={() => setMessage('')}>&times;</span>
//                       <div className='pt-5'> 
//                         <Alert >
//                         {message && <div>{message}</div>}
//                         </Alert>
//                       </div>
//                     </div>
//                   </div>
//                 )}
//       </div>
//     );
// }

// export default ListIAMUsers;

import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import { Spinner, Alert, Modal, Form } from 'react-bootstrap';
import DataTable from 'react-data-table-component';
import DeleteIcon from '@mui/icons-material/Delete';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import GroupRemoveIcon from '@mui/icons-material/GroupRemove';
import axios from 'axios';
import './DeleteUser.css';
import {
  IAMClient,
  ListUsersCommand,
  RemoveUserFromGroupCommand,
  DeleteUserCommand,
  DeleteAccessKeyCommand,
  ListAccessKeysCommand,
  ListGroupsForUserCommand,
  GetUserCommand,
  AddUserToGroupCommand,
  DeleteLoginProfileCommand,
  ListGroupsCommand,
} from '@aws-sdk/client-iam';

const accessKeyId = 'YOUR_ACCESS_KEY';
const secretAccessKey = 'YOUR_SECRET_ACCESS_KEY';
const region = 'us-east-1'; // Replace with your desired AWS region

const deleteAPIurl = 'https://lopzszq3r3.execute-api.us-east-1.amazonaws.com/prod/delete';

const iamClient = new IAMClient({
  region,
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
});

const ListIAMUsers = () => {
  const [users, setUsers] = useState([]);
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteUserMessage, setDeleteUserMessage] = useState('');
  const [message, setMessage] = useState('');
  const [selectedGroup, setSelectedGroup] = useState('');
  const [showAssignForm, setShowAssignForm] = useState(false);
  const [selectedUser, setSelectedUser] = useState('');
  const [showRemoveForm, setShowRemoveForm] = useState(false);
  const [showDeleteToast, setShowDeleteToast] = useState(false);
  const [showMessageModal,setShowMessageModal] = useState('');
  const [showRMessageModal,setshowRMessageModal] = useState('');
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  

  useEffect(() => {
    const fetchData = async () => {
      try {
        const params = { MaxItems: 50 };
        const data = await iamClient.send(new ListUsersCommand(params));

        const usersWithDetails = await fetchUserDetails(data.Users);
        setUsers(usersWithDetails);

        const groupsData = await iamClient.send(new ListGroupsCommand({}));
        setGroups(groupsData.Groups);
      } catch (err) {
        console.log(err);
        setError('Error retrieving users');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const fetchUserDetails = async (users) => {
    const usersWithDetails = [];

    for (const user of users) {
      const userDetails = {
        UserName: user.UserName,
        Arn: user.Arn,
        AccessKeys: [],
        Groups: [],
      };

      const accessKeysParams = {
        UserName: user.UserName,
      };

      const groupsParams = {
        UserName: user.UserName,
      };

      try {
        const accessKeysData = await iamClient.send(new ListAccessKeysCommand(accessKeysParams));
        userDetails.AccessKeys = accessKeysData.AccessKeyMetadata;

        const groupsData = await iamClient.send(new ListGroupsForUserCommand(groupsParams));
        userDetails.Groups = groupsData.Groups;

        usersWithDetails.push(userDetails);
      } catch (err) {
        console.log('Error retrieving user details:', err);
      }
    }

    return usersWithDetails;
  };

  const handleDeleteUser = async (userName) => {
    setShowDeleteConfirmation(true);
    setSelectedUser(userName);
  };
  
  const confirmDeleteUser = async () => {
    try {
      // Find the user to delete
      const userToDelete = users.find((user) => user.UserName === selectedUser);

      if (!userToDelete) {
        setError(`User "${selectedUser}"not found`);
        return;
      }

      // Delete groups for the user
      if (userToDelete.Groups && userToDelete.Groups.length > 0) {
        for (const group of userToDelete.Groups) {
          await iamClient.send(new RemoveUserFromGroupCommand({ GroupName: group.GroupName, UserName: selectedUser }));
        }
      }

      // Delete access keys for the user
      if (userToDelete.AccessKeys && userToDelete.AccessKeys.length > 0) {
        for (const accessKey of userToDelete.AccessKeys) {
          await iamClient.send(new DeleteAccessKeyCommand({ AccessKeyId: accessKey.AccessKeyId, UserName: selectedUser }));
        }
      }

      // Delete login profile for the user
      const userDetails = await iamClient.send(new GetUserCommand({ UserName: selectedUser }));
      if (userDetails.LoginProfile) {
        // Delete the login profile
        await iamClient.send(new DeleteLoginProfileCommand({ UserName: selectedUser }));
      }

      // Delete the user
      const params = {
        UserName: selectedUser,
      };

      // const requestBody = {
      //   username: selectedUser,
      // };

      // Delete the user
      axios
        .delete(deleteAPIurl, {
          data: {
            username: selectedUser,
          },
          headers: {
            'x-api-key': 'YOUR_API_KEY',
          },
        })
     
        .then((response) => {
          console.log('User data stored in the database:', response.data);
        })
        .catch((error) => {
          console.error('Error storing user data:', error);
        });
      await iamClient.send(new DeleteUserCommand(params));
      setUsers(users.filter((user) => user.UserName !== selectedUser));
      setDeleteUserMessage(`Successfully deleted user ${selectedUser}`);
      setShowDeleteConfirmation(false);
      setShowDeleteToast(true);
    } catch (err) {
      console.log(err);
      setError('Error deleting user');
    }
  };

  const handleOpenAssignForm = (userName) => {
    setShowAssignForm(true);
    setSelectedUser(userName);
  };

  const handleOpenRemoveForm = (userName) => {
    setShowRemoveForm(true);
    setSelectedUser(userName);
  };

  const handleAttachGroup = async () => {
    try {
      // Find the user and group to assign
      const userToAssign = users.find((user) => user.UserName === selectedUser);
      const { Groups } = await iamClient.send(new ListGroupsCommand({}));
  
      if (!userToAssign) {
        setMessage(`User "${selectedUser}" not found`);
        return;
      }
  
      if (!selectedGroup) {
        setMessage('Please select a group');
        return;
      }
  
      const groupExists = Groups.some((group) => group.GroupName === selectedGroup);
      if (!groupExists) {
        setMessage(`Group "${selectedGroup}" does not exist`);
        return;
      }
  
      const isUserInGroup = userToAssign.Groups.some((group) => group.GroupName === selectedGroup);
      if (isUserInGroup) {
        setMessage(`User "${selectedUser}" is already a member of group "${selectedGroup}"`);
        setSelectedGroup('');
        setShowAssignForm(false); // Close the assign form
        setShowMessageModal(true); // Display the message modal
        return;
      }
  
      await iamClient.send(new AddUserToGroupCommand({ GroupName: selectedGroup, UserName: selectedUser }));
      setMessage(`Successfully assigned user ${selectedUser} to group ${selectedGroup}`);
      setSelectedGroup('');
      setShowAssignForm(false); // Close the assign form
      setShowMessageModal(true); // Display the message modal
    } catch (err) {
      console.log(err);
      setMessage('Error assigning user to group');
    }
  };
  
  const handleRemoveUserFromGroup = async () => {
    try {
      // Find the user and group to remove
      const userToRemove = users.find((user) => user.UserName === selectedUser);
      const { Groups } = await iamClient.send(new ListGroupsCommand({}));

      if (!userToRemove) {
        setMessage(`User "${selectedUser}" not found`);
        return;
      }

      if (!selectedGroup) {
        setMessage('Please select a group');
        return;
      }

      const groupExists = Groups.some((group) => group.GroupName === selectedGroup);
      if (!groupExists) {
        setMessage(`Group "${selectedGroup}" does not exist`);
        return;
      }

      const isUserInGroup = userToRemove.Groups.some((group) => group.GroupName === selectedGroup);
      if (!isUserInGroup) {
        setMessage(`User "${selectedUser}" is not a member of group "${selectedGroup}"`);
        setSelectedGroup('');
        setShowRemoveForm(false); // Close the assign form
        setshowRMessageModal(true); // Display the message modal
        return;
      }

      await iamClient.send(new RemoveUserFromGroupCommand({ GroupName: selectedGroup, UserName: selectedUser }));
      setMessage(`Successfully removed user ${selectedUser} from group ${selectedGroup}`);
      setSelectedGroup('');
      setShowRemoveForm(false)
      setshowRMessageModal(true);
    } catch (err) {
      console.log(err);
      setMessage('Error removing user from group');
    }
  };

  const columns = [
    {
      name: 'User Name',
      selector: (row) => row.UserName,
      sortable: true,
    },
    {
      name: 'Groups',
      selector: (row) => row.Groups.length,
      sortable: true,
      cell: (row) => (row.Groups.length > 0 ? row.Groups.map((group) => group.GroupName).join(', ') : 'No groups'),
    },
    {
      name: 'ARN',
      selector: (row) => row.Arn,
      sortable: false,
      wrap: true,
      width: '400px',
    },
    {
      name: 'Access Keys',
      selector: (row) => row.AccessKeys.length,
      sortable: true,
      cell: (row) =>
        row.AccessKeys.length > 0 ? row.AccessKeys.map((accessKey) => accessKey.AccessKeyId).join(', ') : 'No access keys',
    },
    {
      name: '',
      sortable: false,
      cell: (row) => (
        <>
          <Button className="ms-2" variant="success" onClick={() => handleOpenAssignForm(row.UserName)}>
            <GroupAddIcon />
          </Button>
          <Button className="ms-2" variant="warning" onClick={() => handleOpenRemoveForm(row.UserName)}>
            <GroupRemoveIcon />
          </Button>
          <Button className="ms-2" variant="danger" onClick={() => handleDeleteUser(row.UserName)}>
            <DeleteIcon />
          </Button>
        </>
      ),
    },
  ];

  return (
    <div className="list-iam-users-container">
      {loading ? (
        <Spinner animation="grow" variant="dark" />
      ) : (
        <>
          {error && <Alert variant="danger">{error}</Alert>}

          <DataTable columns={columns} data={users} />

          <div className="list-iam-users-container">
                  <Modal show={showAssignForm} onHide={() => setShowAssignForm(false)}>
                    <Modal.Header closeButton closeVariant="white" className="text-bg-warning">
                      <Modal.Title>Assign User to Group</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                      <Form>
                        <Form.Group>
                          <Form.Label>Select a group</Form.Label>
                          <Form.Control as="select" value={selectedGroup} onChange={(e) => setSelectedGroup(e.target.value)}>
                            <option value="">Select a group</option>
                            {groups.map((group) => (
                              <option key={group.GroupName} value={group.GroupName}>
                                {group.GroupName}
                              </option>
                            ))}
                          </Form.Control>
                        </Form.Group>
                      </Form>
                    </Modal.Body>
                    <Modal.Footer>
                      <Button variant="primary" onClick={handleAttachGroup}>
                        Assign
                      </Button>
                      <Button variant="secondary" onClick={() => setShowAssignForm(false)}>
                        Cancel
                      </Button>
                    </Modal.Footer>
                  </Modal>

                <Modal show={showMessageModal} onHide={() => setShowMessageModal(false)}>
                  <Modal.Header closeButton closeVariant="white" className="text-bg-warning">
                    <Modal.Title>Assignment Result</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <p>{message}</p>
                  </Modal.Body>
                  <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowMessageModal(false)}>
                      Close
                    </Button>
                  </Modal.Footer>
                </Modal>
          </div>
          
          <div className="list-iam-users-container">
              <Modal show={showRemoveForm} onHide={() => setShowRemoveForm(false)}>
                <Modal.Header closeButton closeVariant="white" className="text-bg-warning">
                  <Modal.Title>Remove User from Group</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <Form>
                    <Form.Group>
                      <Form.Label>Select a group</Form.Label>
                      <Form.Control as="select" value={selectedGroup} onChange={(e) => setSelectedGroup(e.target.value)}>
                        <option value="">Select a group</option>
                        {groups.map((group) => (
                          <option key={group.GroupName} value={group.GroupName}>
                            {group.GroupName}
                          </option>
                        ))}
                      </Form.Control>
                    </Form.Group>
                  </Form>
                </Modal.Body>
                <Modal.Footer>
                  <Button variant="primary" onClick={handleRemoveUserFromGroup}>
                    Remove
                  </Button>
                  <Button variant="secondary" onClick={() => setShowRemoveForm(false)}>
                    Cancel
                  </Button>
                </Modal.Footer>
              </Modal>         

              <Modal show={showRMessageModal} onHide={() => setshowRMessageModal(false)}>
                  <Modal.Header closeButton closeVariant="white" className="text-bg-warning">
                    <Modal.Title>Assignment Result</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <p>{message}</p>
                  </Modal.Body>
                  <Modal.Footer>
                    <Button variant="secondary" onClick={() => setshowRMessageModal(false)}>
                      Close
                    </Button>
                  </Modal.Footer>
                </Modal>

          </div>

          <div className="list-iam-users-container">
              <Modal show={showDeleteConfirmation} onHide={() => setShowDeleteConfirmation(false)}>
                <Modal.Header closeButton closeVariant="white" className="text-bg-warning">
                  <Modal.Title>Delete User</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <p>Are you sure you want to delete user {selectedUser}?</p>
                </Modal.Body>
                <Modal.Footer>
                  <Button variant="danger" onClick={confirmDeleteUser}>
                    Delete
                  </Button>
                  <Button variant="secondary" onClick={() => setShowDeleteConfirmation(false)}>
                    Cancel
                  </Button>
                </Modal.Footer>
              </Modal>

              <Modal show={showDeleteToast} onHide={() => setShowDeleteToast(false)}>
                <Modal.Header closeButton closeVariant="white" className="text-bg-warning">
                  <Modal.Title>Delete User</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <p>{deleteUserMessage}</p>
                </Modal.Body>
                <Modal.Footer>
                  <Button variant="secondary" onClick={() => setShowDeleteToast(false)}>
                    Close
                  </Button>
                </Modal.Footer>
              </Modal>
          </div>

       
        </>
      )}
    </div>
  );
};

export default ListIAMUsers;
