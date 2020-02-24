import React, { useState, createContext } from 'react'

export const Context = createContext()


const ContextProvider = (props) => {
    const [category, setCategory] = useState('none')
    console.log('category :', category);
    return (
        <Context.Provider value={{ category, setCategory }}>
            {props.children}
        </Context.Provider>
    )
}

export default ContextProvider
