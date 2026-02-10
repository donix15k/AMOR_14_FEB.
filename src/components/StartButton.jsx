function StartButton({ onStart }) {
  return (
    <section className="overlay center-layer">
      <button type="button" className="start-button" onClick={onStart}>
        Iniciar
      </button>
    </section>
  );
}

export default StartButton;
