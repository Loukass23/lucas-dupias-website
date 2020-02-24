import React, { useContext } from 'react';
import { Context } from './context/Context'
import Animation from './components/threejs/Animation'



function App() {
  const { category } = useContext(Context)
  return (
    <div className="App">

      <h1>{category}</h1>


      <Animation />
    </div>
  );
}

export default App;
