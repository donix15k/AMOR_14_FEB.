import { useMemo, useState } from 'react';
import StartButton from './components/StartButton';
import ParticleCanvas from './components/ParticleCanvas';
import TextSequence from './components/TextSequence';
import HeartMessage from './components/HeartMessage';

function App() {
  const texts = useMemo(() => ['Te amo', 'mi niña', 'preciosa', 'gracias', 'por existir'], []);
  const [started, setStarted] = useState(false);
  const [currentText, setCurrentText] = useState('');
  const [heartMode, setHeartMode] = useState(false);

  return (
    <main className="app-shell">
      {!started && <StartButton onStart={() => setStarted(true)} />}

      <ParticleCanvas
        started={started}
        texts={texts}
        onTextChange={setCurrentText}
        onHeartMode={setHeartMode}
      />

      {started && !heartMode && <TextSequence text={currentText} />}
      {started && heartMode && <HeartMessage />}
    </main>
  );
}

export default App;
