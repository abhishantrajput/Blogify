import React from 'react'
import Router from '../routes/Router.jsx'
import Header from '../components/Header.jsx'
const Layout = () => {
  return (
    <>

    <Header/>

    <main>
        <Router/>
    </main>
    
    
    </>
  )
}

export default Layout