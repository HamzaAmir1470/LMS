import React from 'react'

const Loader = () => {
  return (
    <div style={containerStyle}>
      <div style={spinnerStyle} />
      
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}

const containerStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '1rem',
}

const spinnerStyle: React.CSSProperties = {
  width: '40px',
  height: '40px',
  border: '4px solid #e5e7eb',      // Light gray background track
  borderTopColor: '#3b82f6',         // Professional blue spinner accent
  borderRadius: '50%',
  animation: 'spin 0.8s linear infinite',
}

export default Loader