import Navbar from '../../components/Navbar';
import Container from 'react-bootstrap/Container';
import { useState } from 'react';
import DynamoDBTableCreation from '../../components/ResourPage.js';
import {getUser} from '../../service/AuthService';

const ResourceP = () => {
	const [isOpen, setIsOpen] = useState(false);
	const user=getUser();
	return (
		<Container fluid>
					<Container>
						<Navbar isOpen={isOpen} setIsOpen={setIsOpen} user={user} />
						<DynamoDBTableCreation />
					</Container>

		</Container>
	);
};

export default ResourceP;