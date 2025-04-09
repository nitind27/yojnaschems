// src/components/LoginForm.tsx
"use client"
import React, { useState } from 'react';
// import bcrypt from 'bcryptjs'; // Example library for hashing

const LoginForm = () => {
  const [sup_contact, setSupContact] = useState('');
  const [sup_password, setSupPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sup_contact, sup_password }),
      });

      if (res.ok) {
        console.log("Login successful");
        // Redirect or update UI after successful login
      } else {
        const data = await res.json();
        setErrorMessage(data.message);
      }
    } catch (error) {
      setErrorMessage('Network error occurred');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="contact">Contact (Username)</label>
      <input 
        id="contact"
        type="text" 
        value={sup_contact} 
        onChange={(e) => setSupContact(e.target.value)} 
        placeholder="Contact (Username)" 
        required 
      />
      <label htmlFor="password">Password</label>
      <input 
        id="password"
        type="password" 
        value={sup_password} 
        onChange={(e) => setSupPassword(e.target.value)} 
        placeholder="Password" 
        required 
      />
      <button type="submit" disabled={loading}>
        {loading ? 'Logging in...' : 'Login'}
      </button>
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
    </form>
  );
};

export default LoginForm;