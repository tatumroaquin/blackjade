import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState } from 'react';

import { Block } from './components/Block';
import { BlockChain } from './components/BlockChain';
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { NavBar } from './components/Nav/NavBar';
import { Transactions } from './components/Transactions';
import { _Block, _BlockChain } from './types';
import { DUMMY_BLOCKCHAIN } from './dummy/BLOCKCHAIN';

import './App.scss';

export default function App() {
  const { chain } = DUMMY_BLOCKCHAIN;
  const block: _Block = chain[1];

  const [showNavBar, setShowNavBar] = useState<boolean>(true);

  return (
    <>
      <Router>
        {showNavBar && <NavBar />}
        <Routes>
          <Route index element={<Home />} />
          <Route path='/blockchain' element={<BlockChain chain={chain} />} />
          <Route path='/block/:hashId' element={<Block />} />
          <Route
            path='/tx-pool'
            element={<Transactions transactions={block.data} />}
          />
          <Route
            path='/login'
            element={<Login setShowNavBar={setShowNavBar} />}
          />
        </Routes>
      </Router>
    </>
  );
}
