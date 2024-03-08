import React, {useEffect, useState} from 'react'

const letrasQwerty = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['Z', 'X', 'C', 'V', 'B', 'N', 'M']
];

const KeyboardCW = ({texto, setTexto}) => {
    // const [texto, setTexto] = useState('');
    const [letters, setLetters] = useState(letrasQwerty);
  
    const agregarTexto = (caracter) => {
        console.log(caracter);
      setTexto(texto + caracter);
    };
  
    const borrarUltimoCaracter = () => {
      setTexto(texto.slice(0, -1));
    };
  
    const limpiarTexto = () => {
      setTexto('');
    };
  
    

    // Función para desordenar las letras en una fila
    const desordenarFila = (fila) => {
    return fila.slice().sort(() => Math.random() - 0.5);
    };

    useEffect(() => {

        const intervalo = setInterval(() => {
            let modLetters = [...letters];
            const ramdomNumber = Math.floor(Math.random() * letrasQwerty.length);
            modLetters[ramdomNumber] = desordenarFila(letrasQwerty[ramdomNumber]);
            setLetters(modLetters);
        },2500);

        return () => {
            clearInterval(intervalo);
        }
    },[]);
  
    return (
        <div>
          <h1>Teclado QWERTY</h1>
          <p>{texto}</p>
          {letters.map((fila, indiceFila) => (
            <div key={indiceFila}>
              {desordenarFila(fila).map((letra, indiceColumna) => (
                <button key={indiceColumna} onClick={() => agregarTexto(letra)}>
                  {letra}
                </button>
              ))}
            </div>
          ))}
          <div>
            <button onClick={borrarUltimoCaracter}>Borrar</button>
            <button onClick={limpiarTexto}>Limpiar</button>
          </div>
        </div>
      );
  };
  

export default KeyboardCW
