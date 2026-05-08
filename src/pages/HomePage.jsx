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
  }

  // SIGN IN
  const signIn = async () => {

    const { data, error } = await supabase.auth.signInWithPassword({
      email: 'test@test.com',
      password: '12345678'
    })

    console.log('SIGN IN:', data, error)
  }

  // SIGN OUT
  const signOut = async () => {

    const { error } = await supabase.auth.signOut()

    console.log('SIGN OUT:', error)
  }

  // GET CURRENT USER
  const getUser = async () => {

    const {
      data: { user }
    } = await supabase.auth.getUser()

    console.log('CURRENT USER:', user)
  }

  // RUN ON PAGE LOAD
  useEffect(() => {
    getUser()
  }, [])

  return (
    <div>

      {/* YOUR EXISTING COMPONENTS */}
      <HeroSection />
      <QuickActions />
      <WeeklyEvents />
      <CommunitiesSection />

      {/* TEST AUTH BUTTONS */}
      <div
        style={{
          position: 'relative',
          zIndex: 9999,
          padding: '30px',
          display: 'flex',
          gap: '15px',
          background: '#ffffff',
          justifyContent: 'center',
          marginTop: '40px',
          flexWrap: 'wrap'
        }}
      >

        <button
          onClick={signUp}
          style={{
            padding: '12px 20px',
            cursor: 'pointer',
            borderRadius: '8px',
            border: '1px solid #ccc',
            background: '#000',
            color: '#fff',
            fontSize: '16px'
          }}
        >
          Sign Up
        </button>

        <button
          onClick={signIn}
          style={{
            padding: '12px 20px',
            cursor: 'pointer',
            borderRadius: '8px',
            border: '1px solid #ccc',
            background: '#0070f3',
            color: '#fff',
            fontSize: '16px'
          }}
        >
          Login
        </button>

        <button
          onClick={signOut}
          style={{
            padding: '12px 20px',
            cursor: 'pointer',
            borderRadius: '8px',
            border: '1px solid #ccc',
            background: '#e11d48',
            color: '#fff',
            fontSize: '16px'
          }}
        >
          Logout
        </button>

        <button
          onClick={getUser}
          style={{
            padding: '12px 20px',
            cursor: 'pointer',
            borderRadius: '8px',
            border: '1px solid #ccc',
            background: '#16a34a',
            color: '#fff',
            fontSize: '16px'
          }}
        >
          Current User
        </button>

      </div>

    </div>
  )
}