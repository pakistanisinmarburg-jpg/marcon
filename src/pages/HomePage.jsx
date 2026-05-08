import { useEffect } from 'react'

import HeroSection from '../components/home/HeroSection'
import QuickActions from '../components/home/QuickActions'
import WeeklyEvents from '../components/home/WeeklyEvents'
import CommunitiesSection from '../components/home/CommunitiesSection'

import { supabase } from '../lib/supabaseClient'

export default function HomePage() {

  // SIGN UP
  const signUp = async () => {

    const { data, error } = await supabase.auth.signUp({
      email: 'test@test.com',
      password: '12345678'
    })

    console.log('SIGN UP:', data, error)

    alert('Sign Up Clicked')
  }

  // SIGN IN
  const signIn = async () => {

    const { data, error } = await supabase.auth.signInWithPassword({
      email: 'test@test.com',
      password: '12345678'
    })

    console.log('SIGN IN:', data, error)

    alert('Login Clicked')
  }

  // SIGN OUT
  const signOut = async () => {

    const { error } = await supabase.auth.signOut()

    console.log('SIGN OUT:', error)

    alert('Logout Clicked')
  }

  // GET CURRENT USER
  const getUser = async () => {

    const {
      data: { user }
    } = await supabase.auth.getUser()

    console.log('CURRENT USER:', user)

    alert('Check Console')
  }

  useEffect(() => {
    getUser()
  }, [])

  return (
    <div>

      {/* FLOATING AUTH PANEL */}
      <div
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          zIndex: 999999,
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          background: 'white',
          padding: '20px',
          borderRadius: '12px',
          boxShadow: '0 0 20px rgba(0,0,0,0.2)'
        }}
      >

        <button
          onClick={signUp}
          style={{
            padding: '12px',
            cursor: 'pointer',
            background: '#000',
            color: '#fff',
            border: 'none',
            borderRadius: '8px'
          }}
        >
          Sign Up
        </button>

        <button
          onClick={signIn}
          style={{
            padding: '12px',
            cursor: 'pointer',
            background: '#0070f3',
            color: '#fff',
            border: 'none',
            borderRadius: '8px'
          }}
        >
          Login
        </button>

        <button
          onClick={signOut}
          style={{
            padding: '12px',
            cursor: 'pointer',
            background: '#e11d48',
            color: '#fff',
            border: 'none',
            borderRadius: '8px'
          }}
        >
          Logout
        </button>

        <button
          onClick={getUser}
          style={{
            padding: '12px',
            cursor: 'pointer',
            background: '#16a34a',
            color: '#fff',
            border: 'none',
            borderRadius: '8px'
          }}
        >
          Current User
        </button>

      </div>

      {/* MAIN PAGE */}
      <HeroSection />
      <QuickActions />
      <WeeklyEvents />
      <CommunitiesSection />

    </div>
  )
}