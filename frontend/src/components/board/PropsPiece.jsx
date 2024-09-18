import React, {useState} from 'react'
import EmojiPicker from 'emoji-picker-react';

const PropsPiece = ({color, setColor, setEmoji, emoji = '😀'}) => {

    const [showPicker, setShowPicker] = useState(false);

    const onEmojiClick = (emojiObject) => {
        setEmoji(emojiObject.emoji);
        setShowPicker(false);
    };

    const handleColorChange = (e) => {
        setColor(e.target.value);
    };

    return (
        <div className="relative flex flex-col items-center space-y-4">
            <div className='w-full flex justify-around'>
                <label htmlFor="color_piece" className='flex items-center'>Elige un color</label>
                <div className="rounded-full w-10 h-10 flex justify-center overflow-hidden relative">
                    <input type="color" name="color_piece" className="w-14 h-14 absolute -top-2" value={color} onChange={handleColorChange}/>
                </div>
            </div>
            <div className="w-full flex justify-around">
                <label htmlFor="emoji_piece" className='flex items-center'>Elige un emoji</label>
                <div className='relative flex flex-col items-center space-y-4'>
                    <button className='btn rounded-full' onClick={() => setShowPicker(!showPicker)}>{emoji}</button>
                    <div className='absolute z-10 top-7 right-0'>
                        <EmojiPicker onEmojiClick={onEmojiClick} open={showPicker} width={300}/>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PropsPiece
