import React from 'react'
import Router from '../routes/Router.jsx'
import Header from '../components/Header.jsx'
import Footer from '../components/Footer.jsx'
const Layout = () => {
  return (
    <>

    <Header/>

    <main>
        <Router/>
    </main>

    <Footer/>
    
    
    </>
  )
}

export default Layout