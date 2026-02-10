import { useMemo, useRef, useState } from 'react';
import StartButton from './components/StartButton';
import ParticleCanvas from './components/ParticleCanvas';
import AudioToggle from './components/AudioToggle';

function App() {
  const texts = useMemo(() => ['Te amo', 'mi niña', 'preciosa', 'gracias', 'por existir'], []);
  const [started, setStarted] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const audioRef = useRef(null);

  const syncAudio = async (enabled) => {
    const audio = audioRef.current;
    if (!audio) return;

    if (enabled) {
      try {
        audio.muted = false;
        audio.volume = 0.42;
        await audio.play();
      } catch {
        // Algunos navegadores bloquean autoplay sin interacción del usuario.
      }
    } else {
      audio.pause();
    }
  };

  const handleToggleAudio = () => {
    const nextValue = !audioEnabled;
    setAudioEnabled(nextValue);
    void syncAudio(nextValue);
  };

  const handleStart = () => {
    setStarted(true);
    void syncAudio(audioEnabled);
  };

  return (
    <main className="app-shell">
      <audio ref={audioRef} src="/musica.mp3" loop autoPlay preload="auto" />

      <AudioToggle enabled={audioEnabled} onToggle={handleToggleAudio} />

      {!started && <StartButton onStart={handleStart} />}

      <ParticleCanvas started={started} texts={texts} />
    </main>
  );
}

export default App;
