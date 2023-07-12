import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import { useState } from 'react';
import GroupPage from '../../components/User groups';
import {getUser} from '../../service/AuthService';

const GroupP = () => {
	const [isOpen, setIsOpen] = useState(false);
	const user=getUser();
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
						<Navbar isOpen={isOpen} setIsOpen={setIsOpen} user={user}/>
						<GroupPage />
					</Container>
				</Col>
			</Row>
		</Container>
	);
};

export default GroupP;