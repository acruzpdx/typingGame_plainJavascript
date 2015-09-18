var model=(function() {
    //------Constants------
    var MAX_ENTRIES_IN_LEVELS = 10; 

    //------Variables------
    var myController = null;
    var level_1 = ['a','s','d','f','g','h','j','k','l',','],
        level_2 = ['q','w','e','r','t','y','u','i','o','p'],
        level_3 = ['z','x','c','v','b','n','m',',','.','/'],
        level_4 = ['of','to','in','it','is','be','as','at','so','we']
        level_5 = ['the','and','are','for','not','but','had','has','was','all'];

    //------Public Functions------
    function setController(c) {
        myController = c;
        console.log("Model: myController set");
    }
    function getRandomDataForLevel(level) {
        var index;
        index = Math.floor( (Math.random() * (MAX_ENTRIES_IN_LEVELS - 1)));
        switch (level) {
            case 1: return level_1[index];
            case 2: return level_2[index];
            case 3: return level_3[index];
            case 4: return level_4[index];
            case 5: return level_5[index];
            default: return "-1";
        }
        
    }

    //------Expose Public Functions------
    return {
        setController : setController,
        getRandomDataForLevel : getRandomDataForLevel
    }
})();

