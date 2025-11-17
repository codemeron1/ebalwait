import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';  
import { ThemeProvider } from './components/theme-provider';

import Layout1 from './layout/layout1';

function App() {
  const [count, setCount] = useState(0)

  return (
    <BrowserRouter>
      <ThemeProvider defaultTheme='dark' storageKey='vite-ui-them'>
        <Routes>
          <Route path='/' element={<Layout1 />}>
            
          </Route>
        </Routes>
      </ThemeProvider>
    </BrowserRouter>
  )
}

export default App
