import React from 'react';
import { Card,Tooltip } from 'antd';

const AssignmentCard = ({ title, description, dueDate, maxScore, link }) => {
    return (
        <Card
            hoverable
            title={
                <Tooltip title={title}>
                  <span>{title}</span>
                </Tooltip>
              }
            bordered={false}
            style={{
                width: 300,
                marginTop:'16px'
            }}
        >
            {/* <Meta title={courseTitle} /> */}
            {/* <Meta title={title} description={description} /> */}
            <p>{description}</p>
            <p>Due Date: {dueDate}</p>
            <p>Max Score: {maxScore}</p>
            <a href={link} target="_blank" rel="noopener noreferrer">
                Go to Assignment
            </a>
        </Card>
    );
};

export default AssignmentCard;
