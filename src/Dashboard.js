// import DashboardDetails from './components/DashboardDetails';
// import Navbar from './components/Navbar';
// import Sidebar from './components/Sidebar';
// import Row from 'react-bootstrap/Row';
// import Col from 'react-bootstrap/Col';
// import Container from 'react-bootstrap/Container';
// import { useState } from 'react';

// const Dashboard = () => {
// 	const [isOpen, setIsOpen] = useState(false);

// 	return (
// 		<Container fluid>
// 			<Row>
// 				{isOpen && (
// 					<Col
// 						sm={12}
// 						md={2}
// 						className="text-bg-warning text-left"
// 						style={{ minHeight: '100vh' }}
// 					>
// 						<Sidebar />
// 					</Col>
// 				)}

// 				<Col md={isOpen ? 10 : 12} sm={12}>
// 					<Container>
// 						<Navbar isOpen={isOpen} setIsOpen={setIsOpen} />
// 						<DashboardDetails />
// 					</Container>
// 				</Col>
// 			</Row>
// 		</Container>
// 	);
// };

// export default Dashboard;

import DashboardDetails from './components/DashboardDetails';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import { useState } from 'react';
import {getUser} from './service/AuthService';
// import {getUser,resetUserSession} from './service/AuthService';

const Dashboard = (props) => {
	const [isOpen, setIsOpen] = useState(false);
	const user=getUser();
	// const name = user !== 'undefined' && user? user.name:'';
	
	// const logoutHandler=()=>{
	// 	resetUserSession();
	// 	props.history.push('/');
	// }
	return (
		<Container fluid>
			<Row>
				{isOpen && (
					<Col
						sm={12}
						md={2}
						className="text-bg-warning text-left"
						style={{ minHeight: '100vh' }}
					>
						<Sidebar />
					</Col>
				)}

				<Col md={isOpen ? 10 : 12} sm={12}>
					<Container>
						<Navbar isOpen={isOpen} setIsOpen={setIsOpen} user={user} />
						<DashboardDetails />
						{/* <div>
      						Hello {name}! You have been loggined in!!!! Welcome to the premium content. <br />
      						<input type="button" value="Logout" onClick={logoutHandler} />
    					</div> */}
					</Container>
				</Col>
			</Row>
		</Container>
	);
};

export default Dashboard;