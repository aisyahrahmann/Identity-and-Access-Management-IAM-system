import { BrowserRouter, Routes, Route} from "react-router-dom";
import Pages from "./pages/Pages";
import React, { useState, useEffect } from "react";
import { getUser, getToken, setUserSession, resetUserSession } from "./service/AuthService";
import axios from "axios";

const verifyTokenAPIURL='https://lopzszq3r3.execute-api.us-east-1.amazonaws.com/prod/verify';

function App() {

  const [ setAuthenicating] = useState(true);
  // const [isAuthenicating, setAuthenicating] = useState(true);
  useEffect(()=>{
    const token=getToken();
    if(token ==='undefined'||token=== undefined||token===null||!token){
      return;
    }
    const requestConfig ={
      headers:{
        'x-api-key': 'hgy7XNweFw5F3cu28m2048PjpgdfSlJI1kOle6im'
      }
    }

    const requestBody = {
      user: getUser(),
      token: token
    }

    axios.post(verifyTokenAPIURL, requestBody,requestConfig).then(response=>{
      setUserSession(response.data.user, response.data.token);
    }).catch(()=>{
      resetUserSession();
      setAuthenicating(false);
    })
  });


  return (
    <BrowserRouter>
      <Routes>
        <Route path="Dashboard">
          <Route index element={<Pages.Dashboard title="Dashboard"/>} /> 
        </Route>
      </Routes>

      <Routes>
        <Route path="Register">
          <Route index element={<Pages.Register title="Register"/>} /> 
        </Route>
      </Routes>

      <Routes>
        <Route path="/">
          <Route index element={<Pages.Login title="Login"/>} /> 
        </Route>
      </Routes>

      <Routes>
        <Route path="/Users">
          <Route index element={<Pages.UsersP title="Users"/>} /> 
        </Route>
      </Routes>

      <Routes>
        <Route path="/User groups">
          <Route index element={<Pages.GroupP title="User groups"/>} /> 
        </Route>
      </Routes>

      <Routes>
        <Route path="/Policies">
          <Route index element={<Pages.PoliciesP title="Policies"/>} /> 
        </Route>
      </Routes>

      {/* <Routes>
        <Route path="/Roles">
          <Route index element={<Pages.RolesP title="Roles"/>} /> 
        </Route>
      </Routes> */}

      <Routes>
        <Route path="/Activity Log">
          <Route index element={<Pages.AccountS title="Activity Log"/>} /> 
        </Route>
      </Routes>

      <Routes>
        <Route path="/ResourcesPage">
          <Route index element={<Pages.ResourceP title="ResourcesPage"/>} /> 
        </Route>
      </Routes>

      <Routes>
        <Route path="/S3">
          <Route index element={<Pages.S3Page title="S3"/>} /> 
        </Route>
      </Routes>

      <Routes>
        <Route path="/DynamoDB">
          <Route index element={<Pages.DynamoP title="DynamoDB"/>} /> 
        </Route>
      </Routes>

    </BrowserRouter>
    
  );
};

export default App;