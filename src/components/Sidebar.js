

import SearchIcon from '@mui/icons-material/Search';
import Form from 'react-bootstrap/Form';
import DashboardIcon from '@mui/icons-material/Dashboard';
import DropDownMenu from './DropDownMenu.js';
import { useEffect, useState } from 'react';
import Alert from 'react-bootstrap/Alert';
import ListGroup from 'react-bootstrap/ListGroup';
import { Link } from "react-router-dom";
import companyLogo from './computionbg.png';
import './Dashboardstyle.css';

const AccessManagmentOptions = ['User groups', 'Users', 'Policies', 'Activity Log'];
const allOptions = [
  ...AccessManagmentOptions,
];

const Sidebar = () => {
  const [query, setQuery] = useState('');
  const [searchResult, setSearchResult] = useState([]);

  useEffect(() => {
    let temp = allOptions.filter((option) =>
      option.toLowerCase().includes(query.toLowerCase()),
    );

    setSearchResult(temp);
  }, [query]);

  return (
    <section className="p-2 d-flex flex-column gap-3 text-left position-sticky position-md-fixed">
      <div className="my-0 align-self-center p-3">
        <img src={companyLogo} alt="Company Logo" className="img-thumbnail remove-background" />
      </div>
      <div className="mb-3">
        <Form className="d-flex align-items-center position-relative">
          <Form.Control
            type="search"
            placeholder="quick access"
            className="rounded-4"
            aria-label="Search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <SearchIcon fontSize="large" className="searchIcon" />
        </Form>
      </div>

      {query ? (
        <>
          {searchResult.length === 0 ? (
            <Alert variant="danger">no result with {query}</Alert>
          ) : (
            <ListGroup>
              {searchResult.map((el, idx) => (
                <Link to={`/${el}`} key={idx} style={{ textDecoration: "none" }}>
                  <ListGroup.Item action className="fw-bold hover-success">
                    {el}
                  </ListGroup.Item>
                </Link>
              ))}
            </ListGroup>
          )}
        </>
      ) : (
        <>
          <div className="mb-3 text-dark d-flex align-items-center">
            <Link to="/Dashboard" className="mb-3 text-dark d-flex align-items-center" style={{ textDecoration: "none" }}>
              <DashboardIcon fontSize="large" />
              <span className="ms-4 fw-bold">Dashboard</span>
            </Link>
          </div>

          <div className="mb-3 text-dark"><strong>SETTINGS</strong></div>
          <DropDownMenu title="Access Management" options={AccessManagmentOptions} />
          <div className="mt-5 text-dark"><strong>License Management</strong></div>
        </>
      )}
    </section>
  );
};

export default Sidebar;
