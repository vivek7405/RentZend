import React from 'react';
import './App.css';
import { Customers } from './components/customers';
import { CustomersForm } from './components/customerForm';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h2>AJENTS</h2>
      </header>
      <CustomersForm></CustomersForm>
      <Customers />
    </div>
  );
}

export default App;
