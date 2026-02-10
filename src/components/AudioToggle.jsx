function AudioToggle({ enabled, onToggle }) {
  return (
    <button
      type="button"
      className="audio-toggle"
      onClick={onToggle}
      aria-label={enabled ? 'Desactivar audio' : 'Activar audio'}
      title={enabled ? 'Desactivar audio' : 'Activar audio'}
    >
      <span className="speaker-icon" aria-hidden="true">
        {enabled ? '🔊' : '🔇'}
      </span>
    </button>
  );
}

export default AudioToggle;
