import React, { useEffect, useState } from 'react'
import { getRandomWords } from '../../../services/gameServices';
import { FcIdea } from "react-icons/fc";
import SyncLoader from "react-spinners/SyncLoader";

export const RandomWord = ({setWord}) => {
    const [alreadySearch, setAlreadySearch] = useState(false);
    const [dataWords, setDataWords] = useState([]);
    const [buttonText, setButtonText] = useState('Ideas');
    const [loading, setLoading] = useState(false);

    useEffect(() => {

    }, []);

    function getWords() {
        setLoading(true);
        getRandomWords()
        .then(data => {
            setDataWords(data);
            setLoading(false);
        });
    }

    function selectWord(event){
        const value = event.target.value;
        if(value != ''){
            setWord(event.target.value);
        }
    }

    function suggestions() {
        getWords();
        setAlreadySearch(true);
        setButtonText('Más ideas');
    }

    return (
        <div className='flex flex-col gap-5'>
            {loading ? <div>
                <SyncLoader/>
            </div>
            :
            <div>
                <button onClick={suggestions} className='btn bg-white border-2 border-orange-500 text-orange-500'><FcIdea />{buttonText}</button>
            </div>}
            {alreadySearch &&
            <div className='mx-auto'>
                <select className='select' onChange={selectWord}>
                    <option value="" className='text-center'>Selecciona una palabra..</option>
                    {
                    dataWords?.map(dataWord => {
                        return (
                        <option key={dataWord} value={dataWord}>{dataWord}</option>
                        );
                    })
                    }
                </select> 
            </div>}
        </div>
    )
}
