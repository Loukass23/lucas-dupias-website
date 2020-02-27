import React, { useContext } from 'react';
import { Context } from './context/Context'
import Animation from './components/threejs/Animation'
import { About } from './components/About';



function App() {
  const { category } = useContext(Context)
  return (
    <div className="App">
      <Animation />
      <h1>{category}</h1>
      {category === "About" && <About />}



    </div>
  );
}

export default App;
