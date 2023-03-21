import react, {useState} from 'react';
import './index.css';
import { Button, Menu } from 'antd';
import {
    AppstoreOutlined,
    ContainerOutlined,
    DesktopOutlined,
    MailOutlined,
    MenuFoldOutlined,
    LineChartOutlined,
    PieChartOutlined,
    HomeOutlined,
  } from '@ant-design/icons';
import Courses from '../Courses';
import Assignments from '../Assignments';
import Exams from '../Exams';
import Reports from '../Reports';
import Home from '../Home';

  function getItem(label, key, icon, children, type) {
    return {
      key,
      icon,
      children,
      label,
      type,
    };
  }
  const items = [
    getItem('Home', 'home', <HomeOutlined />),
    getItem('Courses', 'courses', <PieChartOutlined />),
    getItem('Assignments', 'assignments', <DesktopOutlined />),
    getItem('Exams', 'exams', <ContainerOutlined />),
    getItem('Reports', 'reports', <LineChartOutlined />)
  ];

const SideBar = () => {
    const [collapsed, setCollapsed] = useState(false);
    const [currentTab, setCurrentTab] = useState('home')
    return (
        <div
          style={{
            display:'flex'
          }}
        >
          <Menu
            selectedKeys={[currentTab]}
            onClick={(item,key)=>{setCurrentTab(item.key)}}
            defaultSelectedKeys={['home']}
            defaultOpenKeys={['sub1']}
            mode="inline"
            theme="light"
            inlineCollapsed={collapsed}
            items={items}
            style={{
              width: 256,
            }}
          />
          {currentTab === 'home' && <Home setCurrentTab={setCurrentTab}/>}
          {currentTab === 'courses' && <Courses setCurrentTab={setCurrentTab}/>}
          {currentTab === 'assignments' && <Assignments setCurrentTab={setCurrentTab}/>}
          {currentTab === 'exams' && <Exams setCurrentTab={setCurrentTab}/>}
          {currentTab === 'reports' && <Reports setCurrentTab={setCurrentTab}/>}
        </div>
      );
}

export default SideBar;