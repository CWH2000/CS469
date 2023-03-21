import react, { useState, useEffect } from 'react';
import './index.css';
import courses1 from '../../assets/images/courses1.png'
import { Space, Table, Tag, Button, Progress, Modal } from 'antd';
import StatusCircle from '../Circle';
import axios from '../../axiosInstance';
import moment from 'moment';
import AddCourse from '../AddCourse';

const { Column, ColumnGroup } = Table;
// rowSelection object indicates the need for row selection
const rowSelection = {
  onChange: (selectedRowKeys, selectedRows) => {
    console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
  },
  getCheckboxProps: (record) => ({
    disabled: record.name === 'Disabled User',
    // Column configuration not to be checked
    name: record.name,
  }),
};

const getLevel = (record) => {
  return <div style={{ display: 'flex' }}>
    <StatusCircle status={record.level} />
    <span style={{ marginLeft: '16px' }}>{record.level}</span>
  </div>
}

const Courses = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [courseData, setCourseData] = useState([]);
  const [formData, setFormData] = useState({
    course_name: '',
    course_code: '',
    level: '',
    department: '',
    instructor: '',
    description: '',
    start_date: null,
    end_date: null,
    user_id: '1',
  })
  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleEdit = (courseId) => {
    setIsModalOpen(true);
    const selectedCourseIndex = courseData.findIndex(course => course.id === courseId);
    const selectedCourse = selectedCourseIndex !== -1 ? courseData[selectedCourseIndex] : null;
    setFormData({ ...selectedCourse })
  }

  const handleOk = async () => {
    console.log(formData)
    try {
      //update course
      if (formData.id) {
        const response = await axios.put(`/api/courses/${formData.id}`, formData);
        console.log(response.data);
      } else { //create course
        const response = await axios.post('/api/courses', formData);
        console.log(response.data);
      }
    } catch (error) {
      console.error(error);
    }
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const deleteCourse = async (id) => {
    try {
      const response = await axios.delete(`/api/courses/${id}`);
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  }
  const handleDelete = (record) => {
    Modal.confirm({
      title: `Are you sure you want to delete this course: ${record.course_name}?`,
      onOk() {
        // code to delete the item
        deleteCourse(record.id)
      },
      onCancel() {
        // do nothing
      },
    });
  };
  useEffect(() => {
    axios.get('/courses')
      .then(response => {
        setCourseData(response.data)
      })
      .catch(error => {
        // Handle the error
      });;
  }, []);

  const getCourseComplete = (record) => {
    const startDate = new Date(record.start_date); // Replace with the start date of the course
    const endDate = new Date(record.end_date); // Replace with the end date of the course
    const currentDate = new Date(); // Gets the current date
    if (currentDate > endDate) {
      return <Progress percent={100} />;
    }
    const totalDays = (endDate - startDate) / (1000 * 60 * 60 * 24); // Calculates the total number of days in the course
    const elapsedDays = (currentDate - startDate) / (1000 * 60 * 60 * 24); // Calculates the number of days that have elapsed
    const percentComplete = (elapsedDays / totalDays) * 100; // Calculates the percentage of the course that has been completed
    return <Progress percent={percentComplete.toFixed(2)} />;
  }

  const getCurrentDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const currentDate = `${year}-${month}-${day}`;
    return currentDate;
  }

  return (
    <div style={{ padding: '16px 0' }}>
      {/* <Progress type="circle" percent={30} strokeColor="#f5222d" />
      <img src={courses1} /> */}
      <Modal title="Add Course" width={600}
        open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
        <AddCourse setFormData={setFormData} formData={formData} key="aaa" />
      </Modal>
      <div style={{ display: 'flex', position: 'relative', marginBottom: '10px' }}>
        <div className='left-container'>
          <Button type="primary" onClick={showModal}>
            Add Course
          </Button>
        </div>
        <div className='right-container'>
          Total <b>{courseData.length}</b> Courses.
        </div>
      </div>
      {/* rowSelection={{
        type: 'checkbox',
        ...rowSelection,
      }} */}
      <Table dataSource={courseData} >
      <Column title="Id" dataIndex="id" key="id" />
        <Column title="Course" dataIndex="course_name" key="course_name" />
        {/* <Column title="Last Name" dataIndex="lastName" key="lastName" /> */}
        <Column title="Code" dataIndex="course_code" key="course_code" />
        <Column title="Level" dataIndex="level" key="level"
          render={(_, record) => (
            getLevel(record)
          )} />
        <Column title="Department" dataIndex="department" key="department" />
        <Column title="Instructor" dataIndex="instructor" key="instructor" />
        <Column title="Description" dataIndex="description" key="description" />
        <Column title="Start Date" dataIndex="start_date" key="start_date"
          render={(_, record) => {
            return moment(record.start_date).format('YYYY-MM-DD');
          }} />
        <Column title="End Date" dataIndex="end_date" key="end_date"
          render={(_, record) => {
            return moment(record.end_date).format('YYYY-MM-DD');
          }} />
        <Column title="Complete" dataIndex="level" key="level"
          render={(_, record) => {
            return getCourseComplete(record)
          }}
        />
        <Column
          title="Action"
          key="action"
          render={(_, record) => (
            <Space size="middle">
              <a onClick={() => handleEdit(record.id)}>Edit</a>
              <a onClick={() => handleDelete(record)}>Delete</a>
            </Space>
          )}
        />
      </Table>
    </div>
  );
}

export default Courses;