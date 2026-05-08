import { useEffect } from 'react'
import { supabase } from './lib/supabaseClient'

function App() {

  useEffect(() => {
    console.log("Supabase Connected:", supabase)
  }, [])

  return (
    <div>
      <h1>Supabase Test</h1>
    </div>
  )
}

export default App