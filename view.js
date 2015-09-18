var view = (function() {
//------Constants------
    var YOU_LOST_MSG = "Sorry, you lost! Please click to try again!";
    var CONGRATULATIONS_MSG = "Congratulations! You Won! Please click to play again!";
    var MAX_SCREEN_BLOCKS = 10;


//------Variables------
    var myController = null;

    // Array to hold the DOM elements representing the blocks on the screen
    var screenBlock = [null,null,null,null,null,null,null,null,null,null];

    // Array to hold index values to slots that are ready to be filled with
    // new blocks in the screenBlock array. If this array is empty, it means
    // that all available screenBlock slots are filled and no new blocks can
    // be created until an existing one is eliminated and its index is added
    // to the availableScreenBlockIndex array.
    var availableScreenBlockIndex = [0,1,2,3,4,5,6,7,8,9];
    
    // UI Variables
    var gameBoard = document.getElementById("gameBoard");
    var footer = document.getElementById("footerId");

    // How many pixels down the screen the block should be moved.
    var dropIncrement = 5;
    
    var stringToTest = "";


    //------Private Functions------
    function _makeBlock(data,slot) {
        var tempBlock = document.createElement("div");

        tempBlock.innerHTML = data;
        tempBlock.className = "block";
        tempBlock.style.left = "" + (slot * 10) + "%";
        tempBlock.style.bottom = "85%";
        gameBoard.appendChild(tempBlock);
        screenBlock[slot] = tempBlock;
    }
    function _keyPressHandler(e) {
        var character;

        e.preventDefault();
        if ('charCode' in e) {
            character = e.charCode;
        } else {
            character = e.keyCode;
        }
        processCharacter(String.fromCharCode(character));
        if (myController.isGameOver() == true) {
            myController.stopGame();
            modalMsgBox(CONGRATULATIONS_MSG);
         }
    }
    //------Public Functions------
    function setController(c) {
        myController = c;
        console.log("View: myController set");
    }
    function modalMsgBox(msg) {
        var overlay;
        var mmBox;
        
        overlay = document.createElement("div");
        overlay.className = "overlay";
        mmBox = document.createElement("div");
        mmBox.className = "msgBox";
        mmBox.innerHTML = msg;
        overlay.appendChild(mmBox);
        document.body.appendChild(overlay);
        overlay.addEventListener("click", function() {
            document.body.removeChild(overlay);
            controller.startGame();
        });
    }
    function removeKeypressListener() {
        document.removeEventListener("keypress",_keyPressHandler);
    }
    function addKeypressListener() {
        // Set up keyboard event listener
        document.addEventListener("keypress",_keyPressHandler);
    }
    function processCharacter(s) {
        var i;
        var found = false;

        if (s === ' ') {
            stringToTest = "";
            //footer.innerHTML = "";
            footer.text = "";
        } else {
            stringToTest = stringToTest + s;
            footer.innerHTML = stringToTest;
            for (i = 0; i < screenBlock.length && (!found); i++) {
                if ((screenBlock[i] != null) && (screenBlock[i].innerHTML === stringToTest)) {
                    found = true;
                    screenBlock[i].parentNode.removeChild(screenBlock[i]);
                    screenBlock[i] = null;
                    availableScreenBlockIndex.push(i);
                    stringToTest = "";
                    //footer.innerHTML = "";
                    footer.text = "";
                    controller.incrementDestroyedBlockCount();
                }
            }
        }
    }
    function existsEmptySlotInAvailableBlockIndexArray() {
        if (availableScreenBlockIndex.length != 0) {
            return true;
        } else {
            return false;
        }
    }
    function addBlock () {
        var blockData = null;
        var availableSlot = null;
        
        blockData = myController.getData();
        availableSlot = availableScreenBlockIndex.shift();
        _makeBlock(blockData,availableSlot);
        myController.incrementCreatedBlockCount();
    }
    function advanceExistingScreenBlocks() {
        var i,
            old_bottom_position,
            new_bottom_position;
        
        for (i=0; i < screenBlock.length; i++) {
            if ((screenBlock[i] != null) &&
                (myController.isGameOver() === false)) {
                old_bottom_position = parseInt(screenBlock[i].style.bottom);
                new_bottom_position = old_bottom_position - dropIncrement;
                if (new_bottom_position <= 0) {
                    myController.setUserLost();
                    myController.stopGame();
                    modalMsgBox(YOU_LOST_MSG);
                } else {
                    screenBlock[i].style.bottom = new_bottom_position + "%";
                }
            }
        }
        
    }
    function resetArrays() {
        var i;
        for (i = 0; i < MAX_SCREEN_BLOCKS; i++) {
           if (screenBlock[i] != null) {
                screenBlock[i].parentNode.removeChild(screenBlock[i]);
            }
            screenBlock[i] = null;
            availableScreenBlockIndex[i] = i; 
        }
    }
    function scrambleAvailableBlockIndexArray() {
        var temp;
        var i;
        var swap_position;
        for (i = 0; i < availableScreenBlockIndex.length; i++) {
            swap_position = Math.floor( (Math.random() * (availableScreenBlockIndex.length -1)));
            temp = availableScreenBlockIndex[i];
            availableScreenBlockIndex[i] = availableScreenBlockIndex[swap_position];
            availableScreenBlockIndex[swap_position] = temp;
        }
        
    }
    //------Expose Public Functions------
    return {
        setController : setController,
        addKeypressListener : addKeypressListener,
        removeKeypressListener : removeKeypressListener,
        existsEmptySlotInAvailableBlockIndexArray : existsEmptySlotInAvailableBlockIndexArray,
        advanceExistingScreenBlocks : advanceExistingScreenBlocks,
        addBlock : addBlock,
        resetArrays: resetArrays,
        scrambleAvailableBlockIndexArray : scrambleAvailableBlockIndexArray
    }
    
})();
