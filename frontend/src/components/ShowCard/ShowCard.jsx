import React, { useState, useEffect } from 'react';
import { API_URL } from "../../config.js";

function ShowCard(info) {
  info = info['data'][0];
  const [data, setData] = useState([]);

  {/* Fetch Data From Scrapper*/}
  useEffect(() => {
    const Fetch = async () => {
      const url = `${API_URL}/fetch?param=${info['name.1']}`;
      try {
        const response = await fetch(url);
        if (!response.ok) {throw new Error('Network response was not ok');}

        const rawData = await response.json();
        const parsedData = rawData.map(item => ({
          id: item.id,
          link: item.link,
          price: parseFloat(item.price),
          source: item.source,
          title: item.title
        }));
        setData(parsedData);

      } catch (error) {
        console.error('There was a problem fetching the data:', error);
      }
    };

    Fetch();
  }, []);

  {/* Sorting Functions */}
  const [priceArray, setPriceArray] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
  
  useEffect(() => {
    if (data.length > 0) {
      const sortedPrices = data.map(item => parseFloat(item.price)).sort((a, b) => a - b);
      setPriceArray(sortedPrices);
    }
  }, [data]);

  const minPrice = priceArray.length > 0 ? priceArray[0] : null;
  const medianPrice = priceArray.length > 0 ? priceArray[Math.floor(priceArray.length / 2)] : null;
  const maxPrice = priceArray.length > 0 ? priceArray[priceArray.length - 1] : null;

  
  const handleSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setData([...data].sort((a, b) => {
      if (a[key] < b[key]) {return direction === 'ascending' ? -1 : 1;}
      if (a[key] > b[key]) {return direction === 'ascending' ? 1 : -1;}
      return 0;
    }));
    setSortConfig({ key, direction });
  };
  
  const getArrow = (key) => {
    if (sortConfig.key === key) {return sortConfig.direction === 'ascending' ? '▲' : '▼';}
    return '';
  };

  const handleDelete = (id) => {
    setData(prevData => {
      const updatedData = prevData.filter(item => item.id !== id);
      const updatedPrices = updatedData.map(item => parseFloat(item.price));
      setPriceArray(updatedPrices);
      return updatedData;
    });
  };

  return (
    <>
      {/* INFO */}
      <table className="table container">
        <thead className='table-light'>
          <tr>
            <th scope="col">TAC</th>
            <th scope="col">Manufacturer</th>
            <th scope="col">Model</th>
            <th scope="col">Specs</th>
            <th scope="col">Min</th>
            <th scope="col">Med</th>
            <th scope="col">Max</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th scope="row">{info.tac}</th>
            <td>{info['name']}</td>
            <td>{info['name.1']}</td>
            <td>{info['gsmarena'] ? info['gsmarena'] : 'N/A'}</td>
            <td>{minPrice ? minPrice : '@null'}</td>
            <td>{medianPrice ? medianPrice : '@null'}</td>
            <td>{maxPrice ? maxPrice : '@null'}</td>
          </tr>
        </tbody>
      </table>

      {/* Scrapped */}
      <table className="table table-striped table-hover container">
        <thead>
          <tr>
            <th scope="col" style={{ cursor: 'pointer' }} onClick={() => handleSort('title')}>
              Title {getArrow('title')}
            </th>
            <th scope="col" style={{ cursor: 'pointer' }} onClick={() => handleSort('price')}>
              Price {getArrow('price')}
            </th>
            <th scope="col" style={{ cursor: 'pointer' }} onClick={() => handleSort('source')}>
              Source {getArrow('source')}
            </th>
            <th scope="col">
              Link {getArrow('link')}
            </th>
          </tr>
        </thead>
        <tbody>
          {data.map(item => (
            <tr key={item.id}>
              <td>{item.title}</td>
              <td>{item.price.toFixed(2)}</td>
              <td>{item.source}</td>
              <td>
                <a href={item.link} target="_blank" rel="noopener noreferrer">Here</a>
              </td>
              <td className='d-flex justify-content-end'>
                <button onClick={() => handleDelete(item.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  )
}

export default ShowCard;