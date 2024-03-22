import React from 'react'

function SearchBar() {
  return (
    <div class="input-group mb-3 container bg-black bg-opacity-25 rounded-4">
        <input type="text" class="form-control" placeholder="TAC or IMEI" aria-label="Search" aria-describedby="basic-addon2"/>
        <div class="input-group-append">
            <button class="btn" type="button">
                <img src='../assets/search-icon.webp' style={{width:'32px',height:'32px'}}/>
            </button>
        </div>
    </div>
    
  )
}

export default SearchBar