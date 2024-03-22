import React from 'react'
import SearchBar from './components/SearchBar/SearchBar'
import Announcement from './components/Announcement/Announcement'
import 'bootstrap/dist/css/bootstrap.min.css'

function App() {
  return (
    <div id='main-container' style={{height: '100vh', width: '100vw', paddingTop:'2.5rem'}}>
        <SearchBar />
        <Announcement />
    </div>
  )
}

export default App