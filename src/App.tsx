import { BrowserRouter, Route, Routes } from 'react-router-dom';
import PlayGame from './components/game/game';
import GameList from './components/game/list';

function App() {
  return (
    <div className='App'>
      <header>
        <title>Deck of Cards Game</title>
      </header>
      <BrowserRouter>
        <Routes>
          <Route path='/'>
            <Route index element={<GameList />} />
            <Route path=':gameId' element={<PlayGame />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
