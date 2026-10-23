import React from 'react'

export function Navbar({ children, menu, maxWidth = '1140px', className = '' }) {
  return (
    <div className="sticky-top pt-3 px-3 mb-3" style={{ zIndex: 1030 }}>
      <nav
        className={`overflow-hidden rounded-4 border shadow-sm bg-white bg-opacity-75 mx-auto ${className}`}
        style={{
          maxWidth: typeof maxWidth === 'number' ? `${maxWidth}px` : maxWidth,
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
        }}
      >
        <header className="d-flex align-items-center justify-content-between px-3 px-md-4 py-2" style={{ minHeight: '56px' }}>
          {children}
        </header>
        {menu}
      </nav>
    </div>
  )
}