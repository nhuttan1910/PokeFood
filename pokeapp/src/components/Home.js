import React, { useEffect, useState } from 'react';
import Advertisement from '../layout/Advertisement.js';
import List from '../layout/List.js';
import Contruction from '../layout/Contruction.js';


const Home = () => {

  return (
    <div>
      <Advertisement />
      <List />
      <Contruction />
    </div>
  );
};

export default Home;
