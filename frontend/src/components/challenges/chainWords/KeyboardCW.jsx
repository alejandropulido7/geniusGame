import React, {useEffect, useState} from 'react'

const letrasQwerty = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', 'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'Z', 'X', 'C', 'V', 'B', 'N', 'M'],
    // ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    // ['Z', 'X', 'C', 'V', 'B', 'N', 'M']
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
          <p>{texto}</p>
          <div className='my-5'>
            {letters.map((fila, indiceFila) => (
              <div className='flex flex-wrap justify-center my-2' key={indiceFila}>
                {desordenarFila(fila).map((letra, indiceColumna) => (
                  <button className='btn bg-gray-400 text-black my-2' key={indiceColumna} onClick={() => agregarTexto(letra)}>
                    {letra}
                  </button>
                ))}
              </div>
            ))}
          </div>
          <div className='flex my-5'>
            <button className='btn bg-orange-600 text-white' onClick={borrarUltimoCaracter}>Borrar</button>
            <button className='btn bg-red-600 text-white' onClick={limpiarTexto}>Limpiar</button>
          </div>
        </div>
      );
  };
  

export default KeyboardCW
