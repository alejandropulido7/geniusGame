import React, { useState } from 'react';

const ActingAndWhistle = () => {
  const [mostrarPalabra, setMostrarPalabra] = useState(false);

  const manejarPresionado = () => {
    setMostrarPalabra(true);
  };

  const manejarSuelto = () => {
    setMostrarPalabra(false);
  };

  return (
    <div>
      <button
        onMouseDown={manejarPresionado}
        onMouseUp={manejarSuelto}
        onTouchStart={manejarPresionado}
        onTouchEnd={manejarSuelto}
      >
        Presionar y Soltar
      </button>
      {mostrarPalabra && <p>Palabra visible mientras se mantiene presionado el botón</p>}
    </div>
  );
};

export default ActingAndWhistle;