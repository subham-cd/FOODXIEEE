import React from 'react';
import './Header.css';
import { assets } from '../../assets/assets'; // or direct import header_img from '../../assets/header_img.png';

const Header = () => {
  return (
    <div className='header' style={{ backgroundImage: `url(${assets.header_img})` }}>
      <div className="header-content">
        <h2>Order your favourite food</h2>
        <p>Choose from a diverse menu featuring a delectable array of dishes crafted with finest ingredients and culinary expertise.</p>
        <button>View Menu</button>
      </div>
    </div>
  );
};

export default Header;
