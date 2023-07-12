import React, { useState, useEffect } from 'react';
import { IAMClient, ListUsersCommand, ListRolesCommand, ListGroupsCommand, ListPoliciesCommand } from '@aws-sdk/client-iam';
import { CloudTrail, LookupEventsCommand } from '@aws-sdk/client-cloudtrail';
import './Dashboardstyle.css';
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import PolicyOutlinedIcon from '@mui/icons-material/PolicyOutlined';
import RuleOutlinedIcon from '@mui/icons-material/RuleOutlined';


const DashboardDetails = () => {
  const [userCount, setUserCount] = useState(0);
  const [roleCount, setRoleCount] = useState(0);
  const [groupCount, setGroupCount] = useState(0);
  const [policyCount, setPolicyCount] = useState(0);
  const [latestActivities, setLatestActivities] = useState([]);

  useEffect(() => {
    const fetchIAMCounts = async () => {
      try {
        const iamClient = new IAMClient({
          region: 'us-east-1', // Replace with your desired AWS region
          credentials: {
            accessKeyId: 'AKIA5SFSGTHHY56JRHWV',
            secretAccessKey: 'knOSZ3ldNK/5a9e8/nsaZTmgBM9Cqtk7DXnZu78B',
          },
        });

        const userResponse = await iamClient.send(new ListUsersCommand({}));
        setUserCount(userResponse.Users.length);

        const roleResponse = await iamClient.send(new ListRolesCommand({}));
        setRoleCount(roleResponse.Roles.length);

        const groupResponse = await iamClient.send(new ListGroupsCommand({}));
        setGroupCount(groupResponse.Groups.length);

        const policyResponse = await iamClient.send(new ListPoliciesCommand({}));
        setPolicyCount(policyResponse.Policies.length);
      } catch (err) {
        console.error(err);
      }
    };

    const fetchLatestIAMActivities = async () => {
      try {
        const cloudTrailClient = new CloudTrail({
          region: 'us-east-1', // Replace with your desired AWS region
          credentials: {
            accessKeyId: 'AKIA5SFSGTHHY56JRHWV',
            secretAccessKey: 'knOSZ3ldNK/5a9e8/nsaZTmgBM9Cqtk7DXnZu78B',
          },
        });

        const lookupEventsParams = {
          // StartTime: new Date(Date.now() - 24 * 60 * 60 * 1000), // Look for events within the last 24 hours
          // EndTime: new Date(),
          LookupAttributes: [
            { AttributeKey: 'EventName', AttributeValue: 'CreateUser' },
            { AttributeKey: 'EventName', AttributeValue: 'CreateGroup' },
            { AttributeKey: 'EventName', AttributeValue: 'CreatePolicy' },
          ],
        };

        const eventsResponse = await cloudTrailClient.send(new LookupEventsCommand(lookupEventsParams));
        const events = eventsResponse.Events;

        const userActivities = events
          .filter(event => event.Username === 'testAdmin') // Replace 'testAdmin' with the desired username
          .slice(0, 10)
          .map(event => ({
            EventName: event.EventName,
            EventTime: event.EventTime,
            ResourceName: event.Resources[0].ResourceName,
          }));

        setLatestActivities(userActivities);
      } catch (err) {
        console.error(err);
      }
    };

    fetchIAMCounts();
    fetchLatestIAMActivities();
  }, []);

  return (
    <>
      <div className="d-flex justify-content-between mb-3">
        <h3>Identity and Access Management Dashboard</h3>
      </div>

      <div className="container_lol">
        <div className="row">
          <div className="col-md-3">
            <div className="card-counter primary">
              <div className="card-icon">
                <PersonOutlineOutlinedIcon className="icon" style={{ fontSize: '45px', margin: 0, padding: '0' }} />
              </div>
              <div className="card-details">
                <div className="count-wrapper">
                  <span className="count-numbers">{userCount}</span>
                  <span className="count-name">Users</span>
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-3">
            <div className="card-counter danger">
              <div className="card-icon">
                <RuleOutlinedIcon className="icon" style={{ fontSize: '45px', margin: 0, padding: '0' }} />
              </div>
              <div className="card-details">
                <div className="count-wrapper">
                  <span className="count-numbers">{roleCount}</span>
                  <span className="count-name">Roles</span>
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-3">
            <div className="card-counter success">
              <div className="card-icon">
                <GroupsOutlinedIcon className="icon" style={{ fontSize: '45px', margin: 0, padding: '0' }} />
              </div>
              <div className="card-details">
                <div className="count-wrapper">
                  <span className="count-numbers">{groupCount}</span>
                  <span className="count-name">Groups</span>
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-3">
            <div className="card-counter info">
              <div className="card-icon">
                <PolicyOutlinedIcon className="icon" style={{ fontSize: '45px', margin: 0, padding: '0' }} />
              </div>
              <div className="card-details">
                <div className="count-wrapper">
                  <span className="count-numbers">{policyCount}</span>
                  <span className="count-name">Policies</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container pt-5">
        {/* <div className="row pt-5 gx-2 h-50">
          <div className="col-lg-6"> */}
          <h3>Latest creation made by Admin</h3>
            <div className="shadow-sm p-3 mb-5 bg-body rounded border">
              
              <table className="table">
                <thead>
                  <tr className="table-light">
                    <th >Event Name</th>
                    <th>Event Time</th>
                    <th>Resource Name</th>
                  </tr>
                </thead>
                <tbody>
                  {latestActivities.map((activity, index) => (
                    <tr key={index}>
                      <td className="table-info">{activity.EventName}</td>
                      <td className="table-dark">{activity.EventTime.toString()}</td>
                      <td className="table-warning">{activity.ResourceName}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="col-lg-6">
              
          {/* </div>
        </div> */}
      </div>
    </>
  );
};

export default DashboardDetails;
