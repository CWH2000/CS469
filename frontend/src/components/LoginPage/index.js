import react, { useState } from 'react';
import './index.css';
import { Button, Checkbox, Form, Input } from 'antd';
import axios from '../../axiosInstance';
import { useNavigate } from 'react-router-dom';


const onFinishFailed = (errorInfo) => {
  console.log('Failed:', errorInfo);
};
const LoginPage = () => {
  const navigate = useNavigate();
  const onFinish = async (event) => {
    console.log('Success:', event);
    const {email, password} = event;
      try {
        const response = await axios.post('/login', { email, password });
        console.log(response)
        if(response.status === 200){
          localStorage.setItem('token', response.data.token);
          localStorage.setItem('email', email);
          // redirect to dashboard or home page
          navigate('/dashboard');
        }
      } catch (error) {
        console.log(error.response.data);
      }
  
  };
  return (
    <div>
      <div style={{margin:'auto', width:'600px', marginTop: '160px'}}>
        <div style={{ width: '600px', textAlign: 'center' }}>
          <h1>Course Management System</h1>
        </div>
        <Form
          name="basic"
          labelCol={{
            span: 4,
          }}
          wrapperCol={{
            span: 16,
          }}
          style={{
            maxWidth: 600,
          }}
          initialValues={{
            remember: true,
          }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item
            label="Email"
            name="email"
            rules={[
              {
                required: true,
                message: 'Please input your email!',
              },
            ]}
          >
            <Input type='email'/>
          </Form.Item>
          <Form.Item
            label="Password"
            name="password"
            rules={[
              {
                required: true,
                message: 'Please input your password!',
              },
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            name="remember"
            valuePropName="checked"
            wrapperCol={{
              offset: 4,
              span: 16,
            }}
          >
            <Checkbox>Remember me</Checkbox>
            <a style={{position:'absolute', right:0}} onClick={()=>navigate('/register')}>
              Don't have account, register.
            </a>
          </Form.Item>
          <Form.Item
            wrapperCol={{
              offset: 4,
              span: 8,
            }}
          >
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}

export default LoginPage;