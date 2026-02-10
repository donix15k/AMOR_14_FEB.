function TextSequence({ text }) {
  return (
    <section className="overlay bottom-layer">
      <p key={text} className="sequence-text fade-in-out">
        {text}
      </p>
    </section>
  );
}

export default TextSequence;
