import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Dashboard = () => {
    const navigate = useNavigate();
    const [token, setToken] = useState('');
    const [posts, setPosts] = useState([]);
    
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [image, setImage] = useState(null);
    
    const [message, setMessage] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState(null);

    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        if (!storedToken) {
            navigate('/login');
        } else {
            setToken(storedToken);
            fetchPosts();
        }
    }, [navigate]);

    const fetchPosts = async () => {
        try {
            const response = await axios.get('https://vibely-backend-d6p6.onrender.com/api/posts');
            setPosts(response.data);
        } catch (error) {
            console.error('Gagal mengambil postingan:', error);
        }
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isEditing) {
                // UPDATE: Tambahkan headers Authorization untuk KTP
                const response = await axios.put(`https://vibely-backend-d6p6.onrender.com/api/posts/${editId}`, 
                    { title, content },
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                setMessage(response.data.message);
                setIsEditing(false);
                setEditId(null);
            } else {
                const formData = new FormData();
                formData.append('title', title);
                formData.append('content', content);
                if (image) {
                    formData.append('image', image);
                }

                // UPDATE: Tambahkan headers Authorization bersanding dengan tipe file
                const response = await axios.post('https://vibely-backend-d6p6.onrender.com/api/posts', formData, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data',
                    },
                });
                setMessage(response.data.message);
            }

            setTitle('');
            setContent('');
            setImage(null);
            fetchPosts();
            setTimeout(() => setMessage(''), 3000);
        } catch (error) {
            setMessage(error.response?.data?.message || 'Terjadi kesalahan pada server.');
        }
    };

    const handleEditClick = (post) => {
        setIsEditing(true);
        setEditId(post.id);
        setTitle(post.title);
        setContent(post.content);
        setImage(null);
    };

    const cancelEdit = () => {
        setIsEditing(false);
        setEditId(null);
        setTitle('');
        setContent('');
        setImage(null);
    };

    const handleDeletePost = async (id) => {
        if (window.confirm('Apakah kamu yakin ingin menghapus postingan ini?')) {
            try {
                // UPDATE: Tambahkan headers Authorization saat mau menghapus
                const response = await axios.delete(`https://vibely-backend-d6p6.onrender.com/api/posts/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setMessage(response.data.message);
                fetchPosts();
                setTimeout(() => setMessage(''), 3000);
            } catch (error) {
                console.error('Gagal menghapus postingan:', error);
            }
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <div className="flex flex-col md:flex-row h-screen bg-gray-50 font-sans text-gray-800">
            {/* SIDEBAR */}
            <div className="w-full md:w-64 bg-white border-b md:border-b-0 md:border-r border-gray-200 p-4 md:p-6 flex flex-row md:flex-col justify-between items-center md:items-start shrink-0">
                <div>
                    <h3 className="text-xl md:text-2xl font-bold text-gray-900 tracking-tight">Vibely.</h3>
                    <p className="hidden md:flex text-xs text-green-500 font-medium mt-1 mb-6 items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-green-500"></span> Authenticated
                    </p>
                </div>
                
                <div className="flex gap-2 md:flex-col md:w-full md:mt-auto">
                    <button className="hidden md:block w-full text-left px-4 py-2 bg-gray-100 text-gray-900 rounded-lg font-medium mb-2 transition hover:bg-gray-200">
                        Manage Posts
                    </button>
                    <button 
                        onClick={handleLogout} 
                        className="px-4 py-2 md:w-full md:text-left bg-red-50 md:bg-transparent text-red-600 font-medium rounded-lg transition hover:bg-red-100 md:hover:bg-red-50"
                    >
                        Logout
                    </button>
                </div>
            </div>

            {/* MAIN CONTENT */}
            <div className="flex-1 p-4 md:p-10 overflow-y-auto">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 md:mb-8">Dashboard Admin </h2>
                    
                    {message && (
                        <div className="p-4 mb-6 text-sm font-semibold text-green-800 bg-green-100 rounded-lg">
                            {message}
                        </div>
                    )}

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
                        {/* FORM BIKIN / EDIT POSTINGAN */}
                        <div className="bg-white p-5 md:p-6 rounded-2xl shadow-sm border border-gray-100 h-fit">
                            <h3 className="text-lg md:text-xl font-bold mb-4 md:mb-6 text-gray-900">
                                {isEditing ? ' Edit Teks Postingan' : 'Buat Postingan Baru'}
                            </h3>
                            <form onSubmit={handleFormSubmit} className="flex flex-col gap-4 md:gap-5">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Judul Postingan</label>
                                    <input 
                                        type="text" 
                                        value={title} 
                                        onChange={(e) => setTitle(e.target.value)} 
                                        placeholder="Tulis judul yang menarik..."
                                        className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Konten / Isi</label>
                                    <textarea 
                                        value={content} 
                                        onChange={(e) => setContent(e.target.value)} 
                                        placeholder="Apa yang sedang kamu pikirkan?"
                                        className="w-full p-3 border border-gray-200 rounded-lg h-24 md:h-32 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                                        required
                                    />
                                </div>
                                
                                {!isEditing && (
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1">Upload Gambar (Opsional)</label>
                                        <input 
                                            type="file" 
                                            accept="image/*"
                                            onChange={(e) => setImage(e.target.files[0])} 
                                            className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition cursor-pointer"
                                        />
                                    </div>
                                )}
                                
                                <button 
                                    type="submit" 
                                    className={`w-full py-3 rounded-lg font-bold text-white transition ${isEditing ? 'bg-amber-500 hover:bg-amber-600' : 'bg-blue-600 hover:bg-blue-700'}`}
                                >
                                    {isEditing ? 'Simpan Perubahan' : 'Publish Post'}
                                </button>

                                {isEditing && (
                                    <button 
                                        type="button" 
                                        onClick={cancelEdit} 
                                        className="w-full py-3 bg-gray-200 text-gray-700 font-bold rounded-lg hover:bg-gray-300 transition"
                                    >
                                        Batal Edit
                                    </button>
                                )}
                            </form>
                        </div>

                        {/* DAFTAR FEED POSTINGAN */}
                        <div className="bg-white p-5 md:p-6 rounded-2xl shadow-sm border border-gray-100">
                            <h3 className="text-lg md:text-xl font-bold mb-4 md:mb-6 text-gray-900">Feed Saat Ini</h3>
                            <div className="overflow-y-auto pr-2 space-y-6 max-h-[400px] md:max-h-[600px]">
                                {posts.length === 0 ? (
                                    <div className="text-center py-10 text-gray-400 font-medium">Belum ada postingan. Yuk bikin satu!</div>
                                ) : (
                                    posts.map((post) => (
                                        <div key={post.id} className="pb-6 border-b border-gray-100 last:border-0">
                                            <div className="flex justify-between items-start mb-2">
                                                <h4 className="font-bold text-base md:text-lg text-gray-900">{post.title}</h4>
                                                <span className="text-[10px] md:text-xs text-gray-400">{new Date(post.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                                            </div>
                                            <p className="text-sm text-gray-600 mb-4 whitespace-pre-wrap">{post.content}</p>
                                            
                                            {post.image && (
                                                <img 
                                                    
                                                   src={post.image} 
                                                   alt="Post visual" 
                                                   className="w-full h-48 md:h-64 object-cover rounded-xl mb-4 border border-gray-100"
                                                />
                                            )}

                                            <div className="flex gap-2">
                                                <button 
                                                    onClick={() => handleEditClick(post)} 
                                                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-xs md:text-sm font-semibold hover:bg-gray-200 transition"
                                                >
                                                    Edit
                                                </button>
                                                <button 
                                                    onClick={() => handleDeletePost(post.id)} 
                                                    className="px-4 py-2 bg-red-50 text-red-600 rounded-lg text-xs md:text-sm font-semibold hover:bg-red-100 transition"
                                                >
                                                    Hapus
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
