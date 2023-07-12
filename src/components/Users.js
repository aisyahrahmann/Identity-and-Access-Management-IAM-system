import Button from 'react-bootstrap/Button';
import AddUserModal from './AddUserModal.js';
import {  useState } from 'react';
import UsersTable from './UsersTable.js';
// import AssignUserToGroup from './AddUsertoGrp.js';
// import RemoveUserFromGroup from './RemoveUserfrmGrp.js';


const UserPage = () => {
	const [isAddNew, setIsAddNew] = useState(false);
	const [users, setUsers] = useState({
		loading: false,
		error: false,
		data: [],
	});
	

	const handleClose = () => setIsAddNew(false);

	return (
		<>
			<div className="d-flex justify-content-between mb-3">
				<h3>User Management Page</h3>
				<Button variant="success" onClick={(e) => setIsAddNew(true)}>
					Add New IAM User
				</Button>
			</div>
			{isAddNew && (
				<AddUserModal
					show={isAddNew}
					handleClose={handleClose}
					setUsers={setUsers}
				/>
			)}
			{/* <div className="border">
				<div className="p-4">
					<AssignUserToGroup />
				</div>
			</div>
			<div className="border">
				<div className="p-4">
					<RemoveUserFromGroup />
				</div>
			</div> */}
			<div className='pt-5'>
			<div className="shadow-sm p-3 mb-5 bg-body rounded border">
				<div className=" p-4">
					<h3>List of IAM Users</h3>	
					<div gap={4} className="d-flex flex-column flex-md-row gap-3 ">
					</div>
				</div>		
							
				<UsersTable
					users={users}
					setUsers={setUsers}
				/>
			</div>
			</div>
		</>
	);
};

export default UserPage;


