import react, { useState } from 'react';
import axios from '../../axiosInstance';
import { Button, Checkbox, Form, Input,Alert } from 'antd';
import './index.css'
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const navigate = useNavigate();
    const handleSubmit = async (event) => {
        console.log("submit!!")
        event.preventDefault();
        const { name, email, password, confirmPassword } = formData;
        if (password !== confirmPassword) {
            // Handle password mismatch error
           
            return <Alert message="Success Text" type="success" />;
        }
        try {
            const response = await axios.post('/register', { name, email, password });
            // Handle successful registration
            if(response.status === 200){
                navigate('/login')
                return <Alert message="Register Successfully" type="success" />
            }else{
                return <Alert message="Register Error" type="error" />
            }
        } catch (error) {
            // Handle registration error
        }
    };

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
    };

    return <div>
        <form onSubmit={handleSubmit}>
        <h1>Course Management System Register</h1>
            <label>
                Name:
                <input type="text" name="name" value={formData.name} onChange={handleInputChange} />
            </label>
            <label>
                Email:
                <input type="email" name="email" value={formData.email} onChange={handleInputChange} />
            </label>
            <label>
                Password:
                <input type="password" name="password" value={formData.password} onChange={handleInputChange} />
            </label>
            <label>
                Confirm Password:
                <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleInputChange} />
            </label>
            <button type="submit">Register</button>
        </form></div>
}

export default Register;