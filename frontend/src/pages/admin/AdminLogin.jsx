import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const AdminLogin = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleLogin = (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    setTimeout(() => {
      if (username === 'admin' && password === 'admin123') {
        localStorage.setItem('adminAuth', 'true')
        navigate('/admin/dashboard')
      } else {
        setError('Username atau password salah!')
      }
      setLoading(false)
    }, 800)
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
      <div style={{ backgroundColor: 'white', borderRadius: '16px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', padding: '32px', width: '100%', maxWidth: '400px' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ fontSize: '48px', marginBottom: '12px' }}>🧺</div>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1f2937', marginBottom: '4px' }}>CleanKu Admin</h1>
          <p style={{ color: '#6b7280', fontSize: '14px' }}>Masuk ke panel administrasi</p>
        </div>

        {error && (
          <div style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', borderRadius: '8px', padding: '12px 16px', marginBottom: '20px', fontSize: '14px' }}>
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '4px' }}>
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Masukkan username"
              required
              style={{ width: '100%', border: '1px solid #d1d5db', borderRadius: '8px', padding: '12px 16px', fontSize: '14px' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '4px' }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Masukkan password"
              required
              style={{ width: '100%', border: '1px solid #d1d5db', borderRadius: '8px', padding: '12px 16px', fontSize: '14px' }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{ width: '100%', backgroundColor: '#2563eb', color: 'white', fontWeight: '600', padding: '12px', borderRadius: '8px', cursor: loading ? 'not-allowed' : 'pointer' }}
          >
            {loading ? 'Memverifikasi...' : 'Masuk ke Dashboard'}
          </button>
        </form>

        <div style={{ marginTop: '24px', backgroundColor: '#eff6ff', borderRadius: '8px', padding: '12px 16px', fontSize: '12px', color: '#2563eb', textAlign: 'center' }}>
          Default: username <strong>admin</strong> / password <strong>admin123</strong>
        </div>
      </div>
    </div>
  )
}

export default AdminLogin
