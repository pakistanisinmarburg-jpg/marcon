export default function QuickActions() {

  return (

    <div
      style={{
        padding: '40px',
        background: '#f5f5f5',
        margin: '20px',
        borderRadius: '12px'
      }}
    >

      <h2>Quick Actions</h2>

      <div
        style={{
          display: 'flex',
          gap: '20px',
          marginTop: '20px',
          flexWrap: 'wrap'
        }}
      >

        <button
          style={{
            padding: '12px 20px',
            cursor: 'pointer'
          }}
        >
          Events
        </button>

        <button
          style={{
            padding: '12px 20px',
            cursor: 'pointer'
          }}
        >
          Communities
        </button>

        <button
          style={{
            padding: '12px 20px',
            cursor: 'pointer'
          }}
        >
          Cricket
        </button>

        <button
          style={{
            padding: '12px 20px',
            cursor: 'pointer'
          }}
        >
          Support
        </button>

      </div>

    </div>
  )
}