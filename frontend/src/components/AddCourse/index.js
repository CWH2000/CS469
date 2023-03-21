import { PlusOutlined } from '@ant-design/icons';
import {
  DatePicker,
  Form,
  Input,
  Radio,
} from 'antd';
import { useState } from 'react';
import moment from 'moment';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
dayjs.extend(customParseFormat);

const dateFormat = 'YYYY-MM-DD';
const { TextArea } = Input;
const AddCourse = (props) => {
  const [componentDisabled, setComponentDisabled] = useState(true);

  const updateValue = (value, key) => {
    props.setFormData({ ...props.formData, [key]: value });
  }
  return (
    <>
      <Form
        labelCol={{
          span: 4,
        }}
        wrapperCol={{
          span: 14,
        }}
        layout="horizontal"
        style={{
          maxWidth: 600,
        }}
      >
        <Form.Item label="Name" required={true}>
          <Input value={props.formData.course_name}
          onChange={(event) => updateValue(event.target.value, 'course_name')} />
        </Form.Item>
        <Form.Item label="Code" required={true}>
          <Input value={props.formData.course_code}
          onChange={(event) => updateValue(event.target.value, 'course_code')} />
        </Form.Item>
        <Form.Item label="Level" required={true}>
          <Radio.Group 
          value={props.formData.level}
          onChange={(event) => updateValue(event.target.value, 'level')}>
            <Radio value="Junior"> Junior </Radio>
            <Radio value="Middle"> Middle </Radio>
            <Radio value="Senior"> Senior </Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item label="Department"
          required={true}>
          <Input
           onChange={(event) => updateValue(event.target.value, 'department')} 
          value={props.formData.department}
          />
        </Form.Item>
        <Form.Item label="Instructor"
          required={true}>
          <Input 
           value={props.formData.instructor}
           onChange={(event) => updateValue(event.target.value, 'instructor')}/>
        </Form.Item>
        <Form.Item label="Description"
         
          required={true}>
          <TextArea 
           value={props.formData.description}
          onChange={(event) => updateValue(event.target.value, 'description')}/>
        </Form.Item>
        <Form.Item label="Start Date"
          required={true}>
          <DatePicker  
          defaultValue={dayjs(moment(props.formData.start_date ? props.formData.start_date :  new Date()).format('YYYY-MM-DD'), dateFormat)}
          onChange={(date, dateString) => updateValue(dateString, 'start_date')}/>
        </Form.Item>
        <Form.Item label="End Date"
          required={true}>
          <DatePicker 
           defaultValue={dayjs(moment(props.formData.end_date ? props.formData.end_date : new Date()).format('YYYY-MM-DD'), dateFormat)}
          onChange={(date, dateString) => updateValue(dateString, 'end_date')}/>
        </Form.Item>
      </Form>
    </>
  );
};
export default AddCourse;