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

      {/* TEST BUTTONS */}
      <div style={{ padding: '20px', display: 'flex', gap: '10px' }}>
        <button onClick={signUp}>
          Sign Up
        </button>

        <button onClick={signIn}>
          Login
        </button>

        <button onClick={signOut}>
          Logout
        </button>

        <button onClick={getUser}>
          Current User
        </button>
      </div>

      {/* YOUR EXISTING COMPONENTS */}
      <HeroSection />
      <QuickActions />
      <WeeklyEvents />
      <CommunitiesSection />

    </div>
  )
}