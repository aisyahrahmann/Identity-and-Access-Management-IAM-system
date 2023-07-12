import Button from 'react-bootstrap/Button';
import ListGroup from 'react-bootstrap/ListGroup';
import Addgroup from './Addgroup.js';
import {useState } from 'react';
import GroupTable from './GroupTable.js'


const UserPage = () => {
	const [isAddNew, setIsAddNew] = useState(false);
	const [users ] = useState({
		loading: false,
		error: false,
		data: [],
	});

	// filters state
	const [filters] = useState({});

	const handleClose = () => setIsAddNew(false);
	
	return (
		<>
			<div className="d-flex justify-content-between mb-3">
				<h3>Group Management Page</h3>
				<Button variant="success" onClick={(e) => setIsAddNew(true)}>
					Add New Group
				</Button>
			</div>
			{isAddNew && (
				<Addgroup
					show={isAddNew}
					handleClose={handleClose}
					ListGroup={ListGroup}
				/>
			)}

			<div className='pt-5'>
			<div className="shadow-sm p-3 mb-5 bg-body rounded border">
				<div className=" p-4">
					<h3>List of IAM Groups</h3>	
					<div gap={4} className="d-flex flex-column flex-md-row gap-3 ">
						
					</div>
				</div>

				<GroupTable
					filters={filters}
					users={users}
					ListGroup={ListGroup}
				/>
			</div>
			</div>
		</>
	);
};

export default UserPage;