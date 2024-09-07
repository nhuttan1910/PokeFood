import React, { useEffect, useState } from 'react';
import Advertisement from '../layout/Advertisement.js';
import List from '../layout/List.js';
import Contruction from '../layout/Contruction.js';
import OrderList from './OrderList.js';
import FoodManagement from './FoodManagement.js';

const Home = () => {

  return (
    <div>
      {/* <Advertisement />
      <List />
      <Contruction /> */}
      <OrderList/>
      {/* <FoodManagement/> */}
    </div>
  );
};

export default Home;
