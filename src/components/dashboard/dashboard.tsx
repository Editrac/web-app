import React from 'react';
import { Link } from "react-router-dom";

const Dashboard: React.FC = () => {
  return (
    <>
      <p style={{ color: 'red' }}>Dashboard wow</p>
      <Link to="/user">user</Link>
    </>
  );
};

export default Dashboard;
