import React from 'react'
import {CHALLENGES_IN_BOARD} from '../../utils/constants';

const Box = ({position, color}) => {

    const findIconChallenge = (id) => {
        const challengeFound = CHALLENGES_IN_BOARD.find(challenge => challenge.id == id);
        if(challengeFound){
            return <img width='25x' height='25px' src={challengeFound.icon}></img>
        }
        return null;
    }

    return (
        <div>
            <svg width="67" height="59" viewBox="0 0 67 59" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fill={color} d="M7.07981 51.3618C7.73339 46.7067 8.37659 42.1248 9.02238 37.5444C8.84861 43.9179 8.41549 50.28 8.36881 56.7477C10.3632 56.4229 9.44772 55.0991 12.4822 55.3687V57.5939L13.0917 57.6167C13.4677 57.0092 13.8179 56.4001 14.2302 55.7959C14.3858 55.5701 14.2769 55.2014 15.3014 55.2729C16.1235 55.3314 16.4633 55.5978 16.4296 55.9015C16.3362 56.7883 15.9887 57.6881 18.3695 58.2924C18.0583 56.5853 22.75 55.4792 22.3454 53.6357V56.9556C23.5618 56.5301 22.514 55.7488 23.8264 55.804C25.2072 55.8903 26.5381 56.1737 27.7167 56.6324C28.4143 56.9036 28.4066 57.4705 28.7541 57.9772C30.3699 56.4521 30.6993 54.9204 31.2076 53.3823V56.1435C33.0412 54.0076 36.5581 52.1349 36.654 49.809L37.1053 47.2297L37.7485 47.2135C37.8341 47.4782 37.9327 47.743 38.0079 48.0093C38.4384 49.6855 37.0586 51.4202 39.7041 53.0282C41.3017 53.9946 41.0008 54.0726 43.9497 53.0185L45.0701 53.7071C46.7274 52.0196 45.5888 50.319 46.0479 48.672C47.7129 50.2963 44.567 52.2762 48.4288 53.6113C49.0019 53.8078 51.541 54.4965 53.2994 53.6308C53.3747 54.1473 54.1138 54.2805 55.2005 54.1603C57.0601 53.9638 57.4802 53.3807 57.4491 52.7245C57.2883 49.3396 56.2379 45.9206 57.0731 42.5763C59.166 34.2099 58.2401 25.8159 59.3502 17.4462C59.7963 14.071 60.3539 10.6975 60.8441 7.32236C60.8752 7.10634 60.7766 6.88544 60.647 6.15129C59.664 8.59738 58.1338 10.4717 58.4839 12.8415C58.0067 12.1918 58.1338 11.7841 57.1197 11.7939C56.1057 11.8036 56.1264 12.2129 56.0564 12.4923C55.7192 13.8144 55.4495 15.1398 55.0968 16.7364C54.91 16.2702 54.8374 16.0656 54.6299 15.567C53.8822 16.5383 53.2813 17.5514 52.8352 18.5929C53.3902 14.0889 53.9452 9.58491 54.5781 4.4426C51.9612 6.32346 52.3009 7.78364 51.4658 9.15287C51.5514 8.60063 51.3024 7.99479 51.7848 7.5059C53.2528 6.01323 51.5566 4.82592 49.9486 3.59475C49.6036 3.33 49.6425 2.98891 49.3598 2.7063C49.1042 2.47649 48.7598 2.29097 48.3587 2.16705C47.7544 1.96727 47.5807 2.25151 47.2305 2.37495C45.5162 2.96617 44.3595 2.62346 43.5633 2.01112C41.4236 2.36033 39.8675 2.58935 37.6941 1.76262C36.3584 1.25098 32.9271 0.495717 31.7289 2.36846L30.9794 1.5807C29.0368 4.2347 28.5725 6.77824 28.5311 9.31854C28.1092 7.77444 27.6873 6.23033 27.2654 4.68623L27.6596 4.66999L27.9734 5.48211H28.4455L29.3947 1.71227L28.876 1.68465C28.6296 2.18979 28.3832 2.69655 28.2976 2.86872C28.2976 2.86872 28.1239 2.54387 27.6363 1.61806C26.8375 3.2764 26.3239 4.34514 25.756 5.52758C24.3321 4.25906 27.019 3.05713 25.5173 1.72364L24.6381 3.16108C20.4158 2.99054 24.6252 1.40041 22.0498 0.91152L20.3277 1.56121L18.673 0.848175C18.9998 1.98514 15.2054 2.11832 15.7475 2.83786C16.0613 1.83408 12.1839 2.77451 11.5252 1.92991C6.96829 4.2883 2.81083 49.4224 7.07981 51.3618ZM57.6929 16.1159L57.9211 16.1257V13.4181H58.209C58.0379 14.3179 57.8658 15.2172 57.6929 16.1159Z"/>
                <path fill={color} d="M66.5991 9.05369L66.2827 9.72288C64.8874 8.34066 66.4695 6.96168 64.8407 5.73701C62.146 6.3055 61.9333 7.44408 61.7907 8.42512C61.2875 11.849 60.8077 15.2859 60.2709 18.6984C59.0882 26.1845 59.2594 33.6673 58.9119 41.1501C58.8522 42.4008 59.9311 43.6612 60.551 45.071C61.1942 44.0218 61.329 43.0553 62.3431 42.266C68.8918 37.1155 64.9367 31.6094 65.7666 26.277C66.6043 21.0015 66.6095 15.7033 66.9726 10.4164C67.0037 9.96164 66.9726 9.50685 66.9726 9.05207L66.5991 9.05369Z"/>
                <path fill={color} d="M0.554413 35.1697L1.4025 34.4697L3.24392 34.7848C3.42956 34.5091 3.57286 34.2231 3.67186 33.9304C5.32913 24.8591 7.072 15.7813 8.50882 6.69531C8.74224 5.21564 10.5136 3.73272 9.05606 2.26116C8.67222 1.87297 7.0305 1.46204 5.97493 1.46529C4.82599 1.46529 5.10868 2.13122 5.03606 2.54378C3.55774 11.2838 1.98605 20.014 0.603691 28.7589C0.279497 30.8022 0.554413 32.8584 0.554413 35.1697Z"/>
                <path fill={color} d="M57.6929 16.1159C57.866 15.2193 58.039 14.3227 58.2121 13.4261H57.924V16.1159H57.6929Z"/>
            </svg>
            {position.challenge == ''
            ?
            <div className='absolute top-5 left-6 text-xl text-white font-bold'>{position.position}</div>
            :
            <div className='absolute top-5 left-6 text-xl text-white font-bold'>
                {findIconChallenge(position.challenge)}
            </div>}
        </div>
    )
}

export default Box