function TextSequence({ text, color }) {
  return (
    <section className="overlay bottom-layer">
      <p
        key={text}
        className="sequence-text fade-in-out"
        style={{
          color: color || '#ffe2cb',
          textShadow: `0 0 26px ${color || 'rgba(255, 128, 82, 0.45)'}`,
        }}
      >
        {text}
      </p>
    </section>
  );
}

export default TextSequence;
