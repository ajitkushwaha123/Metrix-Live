import React from 'react'
import { useNavigate } from 'react-router-dom';

const Logout = () => {

  const navigate = useNavigate();
  function userLogout(){
    localStorage.removeItem('token');
    navigate('/');
  }

  return (
    <div>
      <h1> Logout </h1>
    </div>
  )
}

export default Logout
