# AMOR_14_FEB

Animación web interactiva en React con partículas cálidas que:

1. Muestra un botón **Iniciar**.
2. Inicia partículas flotando al presionar el botón.
3. Reacciona al movimiento del mouse con una ligera dispersión.
4. Forma secuencialmente los textos: **Te amo**, **mi niña**, **preciosa**, **gracias**, **por existir**.
5. Termina formando un corazón animado con pulsación suave.

## Ejecutar localmente

```bash
npm install
npm run dev
```

Abre el enlace que te muestra Vite (normalmente `http://localhost:5173`).

## Estructura

- `src/components/StartButton.jsx`: botón inicial.
- `src/components/TextSequence.jsx`: texto animado en secuencia.
- `src/components/HeartMessage.jsx`: mensaje final durante corazón.
- `src/components/ParticleCanvas.jsx`: lógica de partículas, texto, interacción de mouse y corazón.
