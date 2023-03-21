import { Calendar, Badge } from 'antd';
import moment from 'moment';

function ExamCalendar({ examList }) {
  function monthCellRenderer(value) {
    const exams = examList.filter((exam) => {
      const examDate = moment(exam.date, 'YYYY-MM-DD');
      return examDate.year() === value.year() && examDate.month() === value.month();
    });

    return (
      <div>
        {exams.map((exam) => (
          <div key={exam.id}>
            <h3>{exam.title}</h3>
            <p>Date: {exam.date}</p>
            <p>Time: {exam.exam_time}</p>
            <p>Duration: {exam.duration_minutes} minutes</p>
            <a href={exam.link}>Join exam</a>
          </div>
        ))}
      </div>
    );
  }

  const dateCellRender = (value) => {
    // console.log("!!!"+value.format('YYYY-MM-DD'))

    const exams = examList.filter((exam) => {
        console.log(exam.date)
       return moment(exam.date).format('YYYY-MM-DD') === value.format('YYYY-MM-DD')});
    return (
      <ul className="events">
        {exams.map((item) => (
          <li key={item.id}>
            <Badge status={item.title} text={item.title} />
          </li>
        ))}
      </ul>
    );
  };

  return <Calendar monthCellRender={monthCellRenderer} dateCellRender={dateCellRender} />;
}

export default ExamCalendar;