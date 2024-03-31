import React, { useState } from 'react';
import SearchBar from './components/SearchBar/SearchBar';
import Announcement from './components/Announcement/Announcement';
import ShowCard from './components/ShowCard/ShowCard';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [dataFromChild, setDataFromChild] = useState('');
  const [showCardKey, setShowCardKey] = useState(0);

  const handleDataFromChild = (data) => {
    setDataFromChild(data);
    setShowCardKey(prevKey => prevKey + 1);
  };

  return (
    <div id='main-container' style={{ height: '100vh', width: '100vw', paddingTop: '2.5rem' }}>
      <SearchBar sendDataToParent={handleDataFromChild} />
      <Announcement />
      {dataFromChild && <ShowCard key={showCardKey} data={dataFromChild} />}
    </div>
  );
}

export default App;