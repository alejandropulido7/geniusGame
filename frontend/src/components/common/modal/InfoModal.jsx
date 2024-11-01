import React, { useEffect, useState } from 'react'
import { ACTING, BACK_HOME, HUNGED, PICTIONARY, TRIVIA, TRIVIA_VS, WHISTLE_SONG, WORD_CHAIN, OPTIONS_CHALLENGES } from '../../../utils/constants';
import { PictionaryDescription } from '../../challenges/pictionary/PictionaryDescription';
import { ChainWordsDescription } from '../../challenges/chainWords/ChainWordsDescription';
import { HungedDescription } from '../../challenges/hunged/HungedDescription';
import { TriviaDescription } from '../../challenges/trivia/TriviaDescription';
import { ActingDescription } from '../../challenges/acting/ActingDescription';
import { WhistleDescription } from '../../challenges/whistle/WhistleDescription';
import { TriviaVersusDescription } from '../../challenges/trivia-versus/TriviaVersusDescription';

const InfoModal = ({idChallenge}) => {

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState(null);

  useEffect(() => {
    setTitle(OPTIONS_CHALLENGES.get(idChallenge).title);

    switch (idChallenge) {
      case PICTIONARY:
        setDescription(<PictionaryDescription/>)
      break;
      case WORD_CHAIN:
        setDescription(<ChainWordsDescription/>);
      break;
      case HUNGED:
        setDescription(<HungedDescription/>);
      break;
      case TRIVIA:
        setDescription(<TriviaDescription/>);
      break;
      case ACTING:
        setDescription(<ActingDescription/>);
      break;
      case BACK_HOME:
        setDescription(<p></p>);
      break;
      case WHISTLE_SONG:
        setDescription(<WhistleDescription/>);
      break;
      case TRIVIA_VS:
        setDescription(<TriviaVersusDescription/>);
      break;    
      default:
        setDescription(null)
        break;
    }
  }, [idChallenge]);

  return (
    <div className='mx-auto my-4 w-full'>
        <h3 className='text-lg font-black text-white title-wood py-3 px-6'>{title}</h3>
        <div className='text-md text-gray-700'>
          {description}
        </div>
    </div>
  )
}

export default InfoModal
