import react, {useState, useEffect} from 'react';
// import './index.less';
import './index.less';
import calendar from '../../assets/images/calendar.png'
import { Badge, Calendar } from 'antd';
import axios from '../../axiosInstance';
import moment from 'moment';
import ExamCalendar from './ExamCalendar';

const Exams = () => {
  const [examData, setExamData] = useState([]);

  useEffect(() => {
    async function fetchExamData() {
      const response = await axios.get('/exams', {
        params: {
          startDate: '2023-01-01', // example start date
          endDate: '2023-12-31', // example end date
        },
      });
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


  
    return (
        <div
          className='exam-container'
        >
        <ExamCalendar examList={examData} />
        </div>
      );
}

export default Exams;