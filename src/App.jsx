import './App.css'
import Navbar from './components/Navbar/Navbar';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LiquidityPanel from './components/LiquidityPanel/LiquidityPanel';
import { Provider } from 'react-redux';
import Store from './redux/Store';
import SwapComponent from './components/Swap/Swap';
import { Manage } from './components/ManagePositons/Manage';
import Faucet from './components/faucet/faucet';

function App() {

  return (
    <Provider store={Store}>
      <BrowserRouter> 
          <Navbar/>
          <Routes>
          <Route path='/' element={<SwapComponent/>}/>
            <Route path='/swap' element={<SwapComponent/>}/>
            <Route path='/add' element={<LiquidityPanel/>}/>
            <Route path='/manage' element={<Manage/>}/>
            <Route path='/faucet' element={<Faucet/>}/>
          </Routes>
      </BrowserRouter>
    </Provider>
    
  )
}

export default App
