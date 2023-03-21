import react, {useState, useEffect, useRef} from 'react';
import './index.css';
import { Bar } from '@ant-design/plots';
import taskprogress from '../../assets/images/taskprogress.png'
import axios from '../../axiosInstance';

const Reports = () => {
  const [data, setData] = useState([]);
  // const data = [
  //   { assignment: 'Assignment 1', grade: 85 },
  //   { assignment: 'Assignment 2', grade: 92 },
  //   { assignment: 'Assignment 3', grade: 78 },
  //   { assignment: 'Assignment 4', grade: 90 },
  //   { assignment: 'Assignment 5', grade: 88 },
  //   { assignment: 'Assignment 6', grade: 95 },
  // ];

  useEffect(() => {
    axios.get('/grades')
      .then(response => {
        console.log("@@@@@@"+JSON.stringify(response.data))
        setData(response.data)
      })
      .catch(error => {
        // Handle the error
      });
  }, []);

  const config = {
    data,
    xField: 'id',
    yField: 'grade',
    yAxis: {
      label: {
        autoRotate: false,
      },
    },
    scrollbar: {
      type: 'vertical',
    },
  };
  
    return (
        <div
        style={{marginLeft:'200px'}}
        >
          <h1>Finished Assignments and Scores</h1>
          {/* <img src={taskprogress}></img> */}
          <Bar {...config} />
        </div>
      );
}

export default Reports;