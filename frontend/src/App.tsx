import { BrowserRouter, Routes, Route } from 'react-router-dom';
import QuestList from './features/quests/QuestList.tsx';
import QuestForm from './features/quests/QuestForm';
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<QuestList />} />
        <Route path="/create" element={<QuestForm />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
