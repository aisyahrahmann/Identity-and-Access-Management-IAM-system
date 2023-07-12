import Button from 'react-bootstrap/Button';
import { useState } from 'react';
import RolesTable from './RolesTable';
import CreateRoleModal from './AddRoles.js';
import AssignRoleToUser from './AddRolesToUser.js';
import DetachRoleFromUser from './DetachRoleFrmUser.js';

const RolePage = () => {
  const [isAddNewRole, setIsAddNewRole] = useState(false);
  const handleCloseRoleModal = () => setIsAddNewRole(false);
  const [roles, setRoles] = useState({
    loading: false,
    error: false,
    data: [],
  });

  return (
    <>
      <div className="d-flex justify-content-between mb-3">
        <h3>Role Management Page</h3>
        <Button variant="success" onClick={() => setIsAddNewRole(true)}>
          Add New Role
        </Button>
      </div>

      {isAddNewRole && (
        <CreateRoleModal
          show={isAddNewRole}
          handleClose={handleCloseRoleModal}
          setRoles={setRoles}
        />
      )}

      <div className="border">
				<div className="p-4">
					<AssignRoleToUser />
				</div>
			</div>

      <div className="border">
				<div className="p-4">
					<DetachRoleFromUser />
				</div>
			</div>


      <div className="border">
        <div className="p-4">
          <div className="d-flex flex-column flex-md-row gap-3"></div>
        </div>

        <RolesTable roles={roles} setRoles={setRoles} />
      </div>
    </>
  );
};

export default RolePage;
