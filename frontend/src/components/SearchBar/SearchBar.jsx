import React, { useState } from 'react';

function SearchBar({ sendDataToParent }) {
  {/* Variables */}
  const [inputValue, setInputValue] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [errorModalMessage, setErrorModalMessage] = useState('');

  const sendData = (data) => {sendDataToParent(data);};

  {/* HandleSumbit & Fetch Data */}
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (inputValue.length !== 8 && inputValue.length !== 15 && inputValue.length !== 16) {
      setErrorModalMessage('Please enter a valid TAC or IMEI (8, 15, or 16 characters).');
      setShowModal(true);
      return;
    }
    const tmp = inputValue.slice(0, 8);
    const url = `http://127.0.0.1:5000/get?param=${tmp}`;
    // Fetch data from the API (has call limit)
    // const url = `https://di-api.reincubate.com/v1/gsma-tacs/${tmp}/`;
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      if (data.length === 0) {
        throw new Error('No data found');
      }
      sendData(data);

    } catch (error) {
      console.error('There was a problem fetching the data:', error);
      setErrorModalMessage(`There was a problem fetching the data - ${error}`);
      setShowModal(true);
    }    
  };

  {/* HandleChange & CloseModal */}
  const handleChange = (event) => {setInputValue(event.target.value);};
  const closeModal = () => {setShowModal(false);};

  return (
    <>
      {/* Search */}
      <form onSubmit={handleSubmit}>
        <div className="input-group mb-3 container bg-black bg-opacity-25 rounded-4">
          <input 
            type="text" 
            className="form-control" 
            placeholder="TAC or IMEI" 
            aria-label="Search" 
            required
            value={inputValue}
            onChange={handleChange}
          />
          <div className="input-group-append">
            <button className="btn" type="submit">
              <img src="../assets/search-icon.webp" alt="Search" />
            </button>
          </div>
        </div>
      </form>

      {/* Modal */}
      {showModal && (
        <div className="modal d-block">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Error</h5>
              </div>
              <div className="modal-body">
                <p>{errorModalMessage}</p>
              </div>
              <div className="modal-footer border-0">
                <button type="button" className="btn btn-secondary" onClick={closeModal}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default SearchBar;
