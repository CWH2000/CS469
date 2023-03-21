import react, { useState } from 'react';
import './index.css';
import {
  SlackOutlined
} from '@ant-design/icons';
import { Menu } from 'antd';
import axios from '../../axiosInstance'
import { useNavigate } from 'react-router-dom';

const CustomHeader = () => {
  const navigate = useNavigate();
  const handleLogout = async () => {
     // TODO: implement logout functionality
    try {
      const response = await axios.post('/api/logout');
      console.log(response)
      // Remove JWT token from localStorage
      if(response.status === 200){
        localStorage.removeItem('token');
        localStorage.removeItem('email');
        navigate('/login');
      }  
    } catch (error) {
      console.error(error);
    }
  };

  return <div className='header-container'>
    <SlackOutlined className='logo' />
    Courses Managemnent System
    <div className='actions'>
      <Menu mode="horizontal">
        <Menu.SubMenu title={`Logged in as ${localStorage.getItem('email')}`}>
          <Menu.Item key="logout" onClick={handleLogout}>
            Logout
          </Menu.Item>
        </Menu.SubMenu>
      </Menu>
    </div>
  </div>
}

export default CustomHeader;