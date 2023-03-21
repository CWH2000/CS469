import react, {useState, useEffect} from 'react';
import axios from '../../axiosInstance';
import './index.css';
import courses2 from '../../assets/images/courses2.png'
import AssignmentCard from './AssignmentCard';

const Assignments = () => {
  const [assignmentData, setAssignmentData] = useState([]);
  useEffect(() => {
    axios.get('/assignments')
    .then(response => {
      setAssignmentData(response.data)
    })
    .catch(error => {
      // Handle the error
    });
  }, []);

    return (
        <div
          style={{
            display:'flex',
            flexWrap:'wrap',
            justifyContent: 'space-between'
          }}
        >
          {assignmentData.map(assignment=>(
            <AssignmentCard title={assignment.title} description={assignment.description} dueDate={assignment.due_date} maxScore={assignment.max_score} link={assignment.link} />
          ))}
          {/* <img src={courses2}></img> */}
        </div>
      );
}

export default Assignments;