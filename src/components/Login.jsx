import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import logo from '../assets/logo.png';

export function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!email) newErrors.email = "Email is required";
    if (!password) newErrors.password = "Password is required";
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      try {
        const response = await axios.post(
          "http://localhost:8080/api/users/authenticate",
          { email, password }
        );
        
        if (response.data) {
          console.log(response.data);
          const userData = response.data;
          localStorage.setItem('user', JSON.stringify(userData));
          
          if (userData.role === "ADMIN") {
            navigate('/admin');
          } else {
            navigate('/home');
          }
        }
      } catch (error) {
        if (error.response) {
          switch (error.response.status) {
            case 403:
              // Handle inactive account
              setErrors({ 
                general: error.response.data.message || "Account is inactive. Please contact your administrator." 
              });
              break;
            case 401:
              // Handle invalid credentials
              setErrors({ 
                general: error.response.data.message || "Invalid email or password" 
              });
              break;
            default:
              setErrors({ 
                general: "An error occurred. Please try again." 
              });
          }
        } else {
          setErrors({ 
            general: "Network error. Please check your connection." 
          });
        }
      }
    }
  };


  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 py-4">
      <div className="mb-4">
        <img 
          src={logo} 
          alt="Company Logo" 
          className="w-48 h-auto"
        />
      </div>
      <div className="w-full max-w-sm p-6 bg-white rounded-xl shadow-lg">
        <h2 className="text-2xl font-semibold text-gray-900 text-center mb-6">Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-900 mb-1" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 ${
                errors.email ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter your email"
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-900 mb-1" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 ${
                errors.password ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter your password"
            />
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
          </div>
          {errors.general && <p className="text-red-500 text-sm mt-1">{errors.general}</p>}
          <button
            type="submit"
            className="w-full px-4 py-2 mt-4 text-white bg-gray-900 rounded-lg hover:bg-gray-800 transition-colors duration-200"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );

}