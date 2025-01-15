
import React, {useState} from 'react';
import './App.css';

function App() {
  const[ message, setMessage] = useState('');
  return (
    <div className="App">
     <h1>Navigo</h1>
     <button onClick={ ()=>(setMessage("Welcome to Navigo"))}>Click Me</button>
     <p>{message}</p>
    </div>
  );
}

export default App;
