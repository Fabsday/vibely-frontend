import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; 

const Login = () => {
    const navigate = useNavigate(); // <-- 2. Inisialisasi navigate di sini
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            // UPDATE: URL Render untuk Login
            const response = await axios.post('https://vibely-backend-d6p6.onrender.com/api/auth/login', {
                email,
                password
            });

            localStorage.setItem('token', response.data.token);
            localStorage.setItem('role', response.data.role); 
            
            setMessage('Login Berhasil! Mengalihkan...');
            
            setTimeout(() => {
                if (response.data.role === 'admin') {
                    navigate('/dashboard'); 
                } else {
                    navigate('/'); 
                }
            }, 1000);

        } catch (error) {
            setMessage(error.response?.data?.message || 'Terjadi kesalahan saat login.');
        }
    };
    
    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h2 style={styles.title}>Vibely Admin</h2>
                <form onSubmit={handleLogin} style={styles.form}>
                    <div style={styles.inputGroup}>
                        <label>Email</label>
                        <input 
                            type="email" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                            placeholder="Masukkan email"
                            style={styles.input}
                            required
                        />
                    </div>
                    <div style={styles.inputGroup}>
                        <label>Password</label>
                        <input 
                            type="password" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            placeholder="Masukkan password"
                            style={styles.input}
                            required
                        />
                    </div>
                    <button type="submit" style={styles.button}>Login</button>
                </form>
                {message && <p style={styles.message}>{message}</p>}
            </div>
        </div>
    );
};

// Styling dasar rapi (bisa kamu ganti pakai Tailwind nanti)
const styles = {
    container: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f5f5f5' },
    card: { backgroundColor: '#fff', padding: '40px', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', width: '350px' },
    title: { textAlign: 'center', marginBottom: '20px', color: '#333' },
    form: { display: 'flex', flexDirection: 'column' },
    inputGroup: { marginBottom: '15px', display: 'flex', flexDirection: 'column' },
    input: { padding: '10px', marginTop: '5px', borderRadius: '4px', border: '1px solid #ccc' },
    button: { padding: '10px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' },
    message: { marginTop: '15px', textAlign: 'center', color: 'red', fontWeight: 'bold' }
};

export default Login;