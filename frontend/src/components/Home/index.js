import react, { useState, useEffect } from 'react';
import './index.css';
import home from '../../assets/images/home.png'
import { Space, Table, Tag, Button, Progress, Statistic, Card, Descriptions, Avatar, Upload, message } from 'antd';
import StatusCircle from '../Circle';
import { UploadOutlined } from '@ant-design/icons';
import header from '../../assets/images/header.jpg';
import axios from '../../axiosInstance';
import moment from 'moment';

const Home = (props) => {
  const [profilePictureUrl, setProfilePictureUrl] = useState('https://example.com/profile-picture.png');
  const [userInfo, setUserInfo]= useState()
  const [courseData, setCourseData] = useState([]);
  const [examData, setExamData] = useState([]);
  const [assignmentData, setAssignmentData] = useState([]);
  const getUserInfo = async () => {
    try {
      const response = await axios.get('/api/user');
      const user = response.data;
      setUserInfo(user)
      console.log(user);
      // Do something with the user information
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    getUserInfo();
    axios.get('/courses')
    .then(response => {
      setCourseData(response.data)
    })
    .catch(error => {
      // Handle the error
    });
    getUserInfo();

    axios.get('/assignments')
    .then(response => {
      setAssignmentData(response.data)
    })
    .catch(error => {
      // Handle the error
    });

    async function fetchExamData() {
      const response = await axios.get('/exams');
      const formattedExamData = response.data.map((exam) => ({
        id: exam.id,
        title: exam.title,
        date: moment(exam.date),
        startTime: moment(exam.exam_time),
        endTime: moment(exam.exam_time).add(exam.duration_minutes, 'minutes'),
      }));
      setExamData([...formattedExamData]);
    }
    fetchExamData();
  }, []);
  const handleProfilePictureChange = (info) => {
    if (info.file.status === 'done') {
      setProfilePictureUrl(info.file.response.url);
      message.success(`${info.file.name} file uploaded successfully`);
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
    }
  };
  const uploadProps = {
    name: 'file',
    action: 'https://example.com/upload',
    headers: {
      authorization: 'Bearer ' + localStorage.getItem('access_token'),
    },
    onChange: handleProfilePictureChange,
  };

  return (
    <div>
      <div style={{ width: '100%', display: 'flex', marginTop: '16px' }}>
      <Card size="small" bordered={false}
          onClick={()=>props.setCurrentTab('courses')}
          bodyStyle={{
            marginLeft: '16px',
            width: '300px', backgroundColor: 'rgba(80,178,48,0.8)',
            color: "white", height: '100px', display: 'flex', cursor: 'pointer'
          }}>
          <div class="statistics">
            <div class="statistic">
              <div class="label">Total Courses</div>
              <div class="separator"></div>
              <div class="number">{courseData.length}</div>
            </div>
          </div>
        </Card>
        <Card size="small" bordered={false}
        onClick={()=>props.setCurrentTab('assignments')}
          bodyStyle={{
            marginLeft: '16px',
            width: '300px', backgroundColor: 'rgba(28,133,223,0.8)',
            color: "white", height: '100px', display: 'flex', cursor: 'pointer'
          }}>
          <div class="statistics" >
            <div class="statistic">
              <div class="label">Total Assignments</div>
              <div class="separator"></div>
              <div class="number">{assignmentData.length}</div>
            </div>
          </div>
        </Card>

        <Card size="small" bordered={false}
          onClick={()=>props.setCurrentTab('exams')}
          bodyStyle={{
            marginLeft: '16px',
            width: '300px', backgroundColor: 'rgba(253,212,34,0.8)',
            color: "white", height: '100px', display: 'flex', cursor: 'pointer'
          }}>
          <div class="statistics">
            <div class="statistic">
              <div class="label">Total Exams</div>
              <div class="separator"></div>
              <div class="number">{examData.length}</div>
            </div>
          </div>
        </Card>
        {/* <Card size="small" bordered={false}
          bodyStyle={{
            marginLeft: '16px',
            width: '300px', backgroundColor: 'rgba(248,48,63,0.8)',
            color: "white", height: '100px', display: 'flex', cursor: 'pointer'
          }}>
          <div class="statistics">
            <div class="statistic">
              <div class="label">Due Fees</div>
              <div class="separator"></div>
              <div class="number">$1,500</div>
            </div>
          </div>
        </Card> */}
      </div>
      <div style={{ display: 'flex', alignItems: 'flex-start', marginTop: '16px',padding:'16px' }}>
        <div style={{ marginRight: '20px' }}>
          <Upload {...uploadProps}>
            <Avatar size={128} src={header} />
            {/* <Button style={{marginTop:'16px'}} icon={<UploadOutlined />}>Change Profile Picture</Button> */}
          </Upload>
        </div>
        <div>
        {userInfo && <Descriptions title="My Profile" layout="vertical">
            <Descriptions.Item label="Name">{userInfo.first_name + userInfo.last_name}</Descriptions.Item>
            <Descriptions.Item label="Gender">{userInfo.gender}</Descriptions.Item>
            <Descriptions.Item label="Email">{userInfo.email}</Descriptions.Item>
            <Descriptions.Item label="major">{userInfo.major}</Descriptions.Item>
            <Descriptions.Item label="Address">{userInfo.address}</Descriptions.Item>
          </Descriptions>}
        </div>
    </div>
    </div>
  );
}

export default Home;