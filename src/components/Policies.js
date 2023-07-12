import Button from 'react-bootstrap/Button';
import React, { useState } from "react";
import PoliciesTable from './PoliciesTable';
import Addpolicies from './Addpolicies.js';
import AttachPoliGrp from './AddPoliToGrp.js';
import DetachPolicyFromGroup from './DetachPoliFrmGrp';


const PolicyPage = () => {

  const [isAddNewPolicy, setIsAddNewPolicy] = useState(false);
  const handleClosePolicyModal = () => setIsAddNewPolicy(false);
  const [policies, setPolicies] = useState({
		loading: false,
		error: false,
		data: [],
	});

  return (
    <>
      <div className="d-flex justify-content-between mb-3">
        <h3>Policy Management Page</h3>
        <Button variant="success" onClick={() => setIsAddNewPolicy(true)}>
          Add New Policy
        </Button>
      </div>


      {isAddNewPolicy && (
        <Addpolicies
          show={isAddNewPolicy}
          handleClose={handleClosePolicyModal}
          setPolicies={setPolicies}
        />
      )}


      <div className="shadow-sm p-3 bg-body rounded border mb-4">
				<div className="p-1">
					<AttachPoliGrp />
				</div>
			</div>
  
      <div className="shadow-sm p-3 bg-body rounded border mb-4">
        <div className="p-1">
            <DetachPolicyFromGroup />
        </div>
      </div>


      <div className=" mb-4 shadow-sm p-3 bg-body rounded border">
        <div className="p-4">
        <PoliciesTable
            policies ={policies}
            setPolicies={setPolicies}
        />
        </div>
      </div>
    </>
  );
};

export default PolicyPage;
