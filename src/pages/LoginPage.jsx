import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'

export default function LoginPage() {

  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = async () => {

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error) {
      alert(error.message)
      return
    }

    alert('Login successful!')

    navigate('/')
  }

  return (
    <div style={{ padding: '40px' }}>

      <h1>Login Page</h1>

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{
          padding: '12px',
          width: '300px',
          marginBottom: '20px'
        }}
      />

      <br />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{
          padding: '12px',
          width: '300px',
          marginBottom: '20px'
        }}
      />

      <br />

      <button
        onClick={handleLogin}
        style={{
          padding: '12px 20px',
          cursor: 'pointer'
        }}
      >
        Login
      </button>

    </div>
  )
}