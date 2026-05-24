import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Feed = () => {
    const [posts, setPosts] = useState([]);

    // --- STATE UNTUK BUAT POSTINGAN BARU ---
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [image, setImage] = useState(null);

    // --- STATE UNTUK KOMENTAR ---
    const [openComments, setOpenComments] = useState({});
    const [commentsData, setCommentsData] = useState({});
    const [commentText, setCommentText] = useState({});

    const fetchPosts = async () => {
        try {
            // UPDATE: URL Render
            const response = await axios.get('https://vibely-backend-d6p6.onrender.com/api/posts');
            setPosts(response.data);
        } catch (error) {
            console.error('Gagal mengambil postingan:', error);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    // --- FUNGSI BUAT POSTINGAN ---
    const handleCreatePost = async (e) => {
        e.preventDefault(); 
        const token = localStorage.getItem('token');
        
        if (!token) {
            alert('Kamu harus login dulu untuk membuat postingan!');
            return;
        }

        const formData = new FormData();
        formData.append('title', title);
        formData.append('content', content);
        if (image) {
            formData.append('image', image);
        }

        try {
            // UPDATE: URL Render
            await axios.post('https://vibely-backend-d6p6.onrender.com/api/posts', formData, {
                headers: { 
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data' 
                }
            });

            setTitle('');
            setContent('');
            setImage(null);
            
            fetchPosts(); 
        } catch (error) {
            console.error('Gagal membuat postingan:', error);
            alert('Gagal mengupload postingan.');
        }
    };

    const handleLike = async (postId) => {
        const token = localStorage.getItem('token');
        if (!token) return alert('Kamu harus login dulu!');
        try {
            // UPDATE: URL Render
            await axios.post(`https://vibely-backend-d6p6.onrender.com/api/posts/${postId}/like`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchPosts(); 
        } catch (error) {
            console.error('Gagal melakukan like:', error);
        }
    };

    const handleToggleComments = async (postId) => {
        setOpenComments(prev => ({ ...prev, [postId]: !prev[postId] }));
        try {
            // UPDATE: URL Render
            const response = await axios.get(`https://vibely-backend-d6p6.onrender.com/api/posts/${postId}/comments`);
            setCommentsData(prev => ({ ...prev, [postId]: response.data }));
        } catch (error) {
            console.error('Gagal mengambil komentar:', error);
        }
    };

    const handleCommentSubmit = async (postId) => {
        const token = localStorage.getItem('token');
        if (!token) return alert('Kamu harus login dulu!');
        const text = commentText[postId];
        if (!text || text.trim() === '') return;

        try {
            // UPDATE: URL Render
            await axios.post(
                `https://vibely-backend-d6p6.onrender.com/api/posts/${postId}/comments`,
                { comment_text: text },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setCommentText(prev => ({ ...prev, [postId]: '' }));
            // UPDATE: URL Render
            const response = await axios.get(`https://vibely-backend-d6p6.onrender.com/api/posts/${postId}/comments`);
            setCommentsData(prev => ({ ...prev, [postId]: response.data }));
        } catch (error) {
            console.error('Gagal kirim komentar:', error);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 font-sans text-gray-800 pb-20">
            {/* NAVBAR */}
            <nav className="bg-white border-b border-gray-200 sticky top-0 z-10 px-4 py-3 flex justify-between items-center shadow-sm">
                <div className="max-w-2xl mx-auto w-full flex justify-between items-center">
                    <h1 className="text-2xl font-extrabold tracking-tighter text-gray-900">Vibely.</h1>
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-1.5 rounded-full font-semibold text-sm transition">
                        Login
                    </button>
                </div>
            </nav>

            <main className="max-w-xl mx-auto mt-8 px-4">
                
                {/* --- KOTAK BUAT POSTINGAN --- */}
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 mb-8">
                    <h2 className="font-bold text-gray-800 mb-4">Bagikan getaranmu hari ini...</h2>
                    <form onSubmit={handleCreatePost} className="space-y-3">
                        <input 
                            type="text" 
                            placeholder="Judul Postingan" 
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-blue-500"
                        />
                        <textarea 
                            placeholder="Apa yang sedang kamu pikirkan?" 
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            required
                            rows="3"
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-blue-500 resize-none"
                        ></textarea>
                        <div className="flex justify-between items-center">
                            <input 
                                type="file" 
                                accept="image/*"
                                onChange={(e) => setImage(e.target.files[0])}
                                className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                            />
                            <button 
                                type="submit" 
                                className="bg-blue-600 text-white px-6 py-2 rounded-full font-bold text-sm hover:bg-blue-700 transition"
                            >
                                Posting
                            </button>
                        </div>
                    </form>
                </div>

                {/* --- DAFTAR FEED --- */}
                {posts.length === 0 ? (
                    <div className="text-center py-20">
                        <h2 className="text-xl font-bold text-gray-400">Belum ada getaran di Vibely.</h2>
                    </div>
                ) : (
                    <div className="space-y-8">
                        {posts.map((post) => (
                            <article key={post.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                                {/* POST HEADER */}
                                <div className="p-4 flex items-center gap-3">
                                    <div className="w-10 h-10 bg-gradient-to-tr from-blue-500 to-purple-500 rounded-full flex-shrink-0"></div>
                                    <div>
                                        <h3 className="font-bold text-sm text-gray-900">{post.username || 'Anonim'}</h3>
                                        <p className="text-xs text-gray-500">
                                            {new Date(post.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long' })}
                                        </p>
                                    </div>
                                </div>

                                {/* POST IMAGE */}
                                {post.image && (
                                    <img 
                                        // UPDATE: URL Render untuk Gambar
                                        src={`https://vibely-backend-d6p6.onrender.com/uploads/${post.image}`} 
                                        alt="Post visual" 
                                        className="w-full h-auto object-cover border-y border-gray-100 max-h-[600px]"
                                    />
                                )}

                                {/* POST CONTENT */}
                                <div className="p-4">
                                    <h4 className="font-bold text-gray-900 mb-1">{post.title}</h4>
                                    <p className="text-sm text-gray-800 whitespace-pre-wrap leading-relaxed">
                                        {post.content}
                                    </p>
                                </div>

                                {/* INTERACTION BAR */}
                                <div className="px-4 pb-4 flex gap-4 text-gray-500">
                                    <button onClick={() => handleLike(post.id)} className="hover:text-red-500 transition flex items-center gap-1 text-sm font-medium">
                                        ❤️ {post.likes_count || 0} Suka
                                    </button>
                                    <button onClick={() => handleToggleComments(post.id)} className="hover:text-blue-500 transition flex items-center gap-1 text-sm font-medium">
                                        💬 Komentar
                                    </button>
                                </div>

                                {/* AREA KOMENTAR */}
                                {openComments[post.id] && (
                                    <div className="px-4 pb-4 border-t border-gray-100 pt-3 bg-gray-50">
                                        <div className="space-y-2 mb-3 max-h-40 overflow-y-auto">
                                            {commentsData[post.id] && commentsData[post.id].length > 0 ? (
                                                commentsData[post.id].map(comment => (
                                                    <div key={comment.id} className="bg-white p-2.5 rounded-lg shadow-sm border border-gray-100 text-sm">
                                                        <span className="font-bold text-gray-900 mr-2">{comment.username}</span>
                                                        <span className="text-gray-700">{comment.comment_text}</span>
                                                    </div>
                                                ))
                                            ) : (
                                                <p className="text-xs text-gray-400 italic">Belum ada komentar. Jadilah yang pertama!</p>
                                            )}
                                        </div>
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                value={commentText[post.id] || ''}
                                                onChange={(e) => setCommentText(prev => ({ ...prev, [post.id]: e.target.value }))}
                                                placeholder="Tambahkan komentar..."
                                                className="flex-1 text-sm border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                                            />
                                            <button onClick={() => handleCommentSubmit(post.id)} className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-bold hover:bg-blue-700 transition">
                                                Kirim
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </article>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
};

export default Feed;