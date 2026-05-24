import { useState } from 'react';
import axios from 'axios';

function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      // UPDATE: Menembak API backend di Render
      const response = await axios.post('https://vibely-backend-d6p6.onrender.com/api/auth/register', {
        username,
        email,
        password
      });
      setMessage(response.data.message); // Jika sukses, tampilkan pesan dari backend
    } catch (error) {
      // Jika gagal, tampilkan pesan error dari backend
      setMessage(error.response?.data?.message || 'Terjadi kesalahan');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', fontFamily: 'sans-serif', border: '1px solid #ddd', borderRadius: '10px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
      <h2 style={{ textAlign: 'center', color: '#4F46E5' }}>Join Vibely ✨</h2>
      <p style={{ textAlign: 'center', color: '#666', fontSize: '14px' }}>Create an account to start sharing your vibes</p>
      
      <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <input 
          type="text" 
          placeholder="Username" 
          value={username} 
          onChange={(e) => setUsername(e.target.value)} 
          style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
        />
        <input 
          type="email" 
          placeholder="Email Address" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
        />
        <input 
          type="password" 
          placeholder="Password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
        />
        <button type="submit" style={{ padding: '10px', backgroundColor: '#4F46E5', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>
          Register
        </button>
      </form>

      {message && <p style={{ marginTop: '15px', textAlign: 'center', fontWeight: 'bold', color: message.includes('berhasil') ? 'green' : 'red' }}>{message}</p>}
    </div>
  );
}

export default Register;