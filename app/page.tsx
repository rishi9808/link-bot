"use client";
import axios from 'axios';

export default function Home() {
  const handleLinkedInLogin = async () => {
    try {
      const res = await axios.get('/api/auth/linkedin');
      window.location.href = res.data.authUrl;
    } catch (err) {
      alert('Failed to initiate LinkedIn login');
      console.error(err);
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1>LinkedIn OAuth via Axios</h1>
      <button onClick={handleLinkedInLogin}>Sign in with LinkedIn</button>
    </div>
  );
}