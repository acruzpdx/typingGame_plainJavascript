var controller = (function() {
    //------Constants------
    var MAX_BLOCKS_PER_GAME = 50;
    var MAX_BLOCKS_PER_LEVEL = 10;


    //------Variables------
    var myView = null;
    var myModel = null;
    var currentLevel = 1;
    var numBlocksCreated = 0;
    var numBlocksDestroyed = 0;
    var userLost = false;
    var gameTimer = null;

    //------Private Functions------
    function _playGame() {
        myView.advanceExistingScreenBlocks();
        if (myView.existsEmptySlotInAvailableBlockIndexArray() &&
            (numBlocksCreated < MAX_BLOCKS_PER_GAME)) {
            myView.addBlock();
        }
    }
    //------Public Functions------
    function setView(v) {
        myView = v;
        console.log("Controller: myView set.");
    };
    function setModel(m) {
        myModel = m;
        console.log("Controller: myModel set.");
    };
    function incrementDestroyedBlockCount() {
        numBlocksDestroyed++;
    }
    function incrementCreatedBlockCount() {
        numBlocksCreated++;
        currentLevel = Math.floor(numBlocksCreated/MAX_BLOCKS_PER_LEVEL) + 1;
        if (numBlocksCreated === MAX_BLOCKS_PER_GAME) {
            debugger;
        }
    }
    function stopGame() {
        clearInterval(gameTimer);
        myView.removeKeypressListener();
    }
    function startGame() {
        currentLevel = 1;
        numBlocksCreated = 0;
        numBlocksDestroyed = 0;
        userLost = false; 
        myView.resetArrays();
        myView.scrambleAvailableBlockIndexArray();
        myView.addKeypressListener();
        gameTimer = setInterval(_playGame,1000);
        
    }
    function getData() {
        return myModel.getRandomDataForLevel(currentLevel);
    }
    function setUserLost() {
        userLost = true;
    }
    function isGameOver() {
        if ((userLost === true) || (numBlocksDestroyed === MAX_BLOCKS_PER_GAME)) {
            return true;
        } else {
            return false;
        }
    }

    //------Expose Public Functions------
    return {
        setView : setView,
        setModel : setModel,
        incrementDestroyedBlockCount : incrementDestroyedBlockCount,
        incrementCreatedBlockCount : incrementCreatedBlockCount,
        startGame : startGame,
        stopGame : stopGame,
        getData : getData,
        setUserLost: setUserLost,
        isGameOver : isGameOver
    }

})();
