const {removeFlagToTeam} = require('../../app/controllers/teams');

const removeFlags = (flagsObtained, flag) => {

    let result = [];
    if(flagsObtained.length > 0){
        let duplicateFlags = flagsObtained.filter(flagFilter => flagFilter == flag);
        flagsObtained = flagsObtained.filter(flagFind => flagFind != flag);    
        if(duplicateFlags.length > 1){
            duplicateFlags.pop();
            flagsObtained.push(...duplicateFlags);
        }
    }
    
    return flagsObtained;
}

test('should remove flag from opponent player', () => { 

    let flags = ["blue", "red", "green", "blue"]
    const response = removeFlags(flags, "blue");
    
    expect(response).toEqual(["red", "green", "blue"]);
 })