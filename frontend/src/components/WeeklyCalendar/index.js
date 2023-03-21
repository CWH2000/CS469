import React, { Component } from 'react';
import { Calendar } from 'antd';

class WeeklyCalendar extends Component {
  renderCell = (date) => {
    const { events } = this.props;
    const eventList = events.filter((event) => {
      return event.date === date.format('YYYY-MM-DD');
    });

    return (
      <div>
        <div>{date.format('D')}</div>
        <div>
          {eventList.map((event) => (
            <div key={event.id}>{event.title}</div>
          ))}
        </div>
      </div>
    );
  };

  render() {
    const { date } = this.props;
    const start = date.clone().startOf('week');
    const end = date.clone().endOf('week');

    return (
      <Calendar
        dateCellRender={this.renderCell}
        value={[start, end]}
        mode="week"
      />
    );
  }
}

export default WeeklyCalendar;
