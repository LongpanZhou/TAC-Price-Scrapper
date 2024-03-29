import React, { useState, useEffect} from 'react';

function ShowCard(info) {
  info = info['data'][0]
  const [data, setData] = useState([
    { id: 1, title: "Product 1", price: "$10", source: "Shop A", link: "http://example.com/product1" },
    { id: 2, title: "Product 2", price: "$20", source: "Shop B", link: "http://example.com/product2" },
    { id: 3, title: "Product 3", price: "$15", source: "Shop C", link: "http://example.com/product3" },
    { id: 4, title: "Product 4", price: "$25", source: "Shop D", link: "http://example.com/product4" },
    { id: 5, title: "Product 5", price: "$30", source: "Shop E", link: "http://example.com/product5" },
    { id: 6, title: "Product 1", price: "$10", source: "Shop A", link: "http://example.com/product1" },
    { id: 7, title: "Product 2", price: "$20", source: "Shop B", link: "http://example.com/product2" },
    { id: 8, title: "Product 3", price: "$15", source: "Shop C", link: "http://example.com/product3" },
    { id: 9, title: "Product 4", price: "$25", source: "Shop D", link: "http://example.com/product4" },
    { id: 10, title: "Product 5", price: "$30", source: "Shop E", link: "http://example.com/product5" },
    { id: 11, title: "Product 1", price: "$10", source: "Shop A", link: "http://example.com/product1" },
    { id: 12, title: "Product 2", price: "$20", source: "Shop B", link: "http://example.com/product2" },
    { id: 13, title: "Product 3", price: "$15", source: "Shop C", link: "http://example.com/product3" },
    { id: 14, title: "Product 4", price: "$25", source: "Shop D", link: "http://example.com/product4" },
    { id: 15, title: "Product 5", price: "$30", source: "Shop E", link: "http://example.com/product5" },
    ]);
  
  {/* Variables & Sorting */}
  const sortable = {cursor: 'pointer'}
  const [priceArray, setPriceArray] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });

  useEffect(() => {
    if (data.length > 0) {
      const sortedPrices = data.map(item => parseFloat(item.price.slice(1))).sort((a, b) => a - b);
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
    setData(data.filter(item => item.id !== id));
    setPriceArray(priceArray.filter(price => price !== parseFloat(data.find(item => item.id === id).price.slice(1))));
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
            <th scope="col" style={sortable} onClick={() => handleSort('title')}>
              Title {getArrow('title')}
            </th>
            <th scope="col" style={sortable} onClick={() => handleSort('price')}>
              Price {getArrow('price')}
            </th>
            <th scope="col" style={sortable} onClick={() => handleSort('source')}>
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
              <td>{item.price}</td>
              <td>{item.source}</td>
              <td>
                <a href={item.link} target="_blank" rel="noopener noreferrer">{item.link}</a>
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

export default ShowCard