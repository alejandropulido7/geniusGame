import React, {useState} from 'react'
import { FaClipboard, FaCheck } from 'react-icons/fa';

const AllowJoin = ({textToCopy}) => {

    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(textToCopy)
          .then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
          })
          .catch(err => {
            console.error('Error al copiar el texto: ', err);
          });
      };

    return (
        <div className="w-52 flex flex-col items-center mt-5 overflow-hidden">
            <p className="w-full h-10 block mb-4 text-wrap">{textToCopy}</p>
            <button 
                onClick={handleCopy} 
                className="relative flex items-center px-4 py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 transition"
            >
                {copied ? <FaCheck className="mr-2" /> : <FaClipboard className="mr-2" />}
                {copied ? 'Copiado' : 'Copiar'}

                {copied && (
                <span className="absolute top-full mt-2 px-2 py-1 text-xs bg-gray-800 text-white rounded-md shadow-lg">
                    ¡Texto copiado!
                </span>
                )}
            </button>
        </div>
    )
}

export default AllowJoin
