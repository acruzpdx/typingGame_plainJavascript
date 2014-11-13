/*------------------------------------------------------------------*
 * File: 		typingGame.js
 * Author: 		Agapito Cruz (agapito.cruz@gmail.com)
 * Comments:	This file was written to demonstrate proficiency
 * 				in the Javascript language and in the use of 
 * 				various techniques and design patterns common
 * 				in web app construction.
 * 				This is one of three files needed to play the 
 * 				game. The other two are: index.html and main.css
 ------------------------------------------------------------------*/

var typingGame=(function() {
		var currentLevel,
			level_1 = ['a','s','d','f','g','h','j','k','l',','],
			level_2 = ['q','w','e','r','t','y','u','i','o','p'],
			level_3 = ['z','x','c','v','b','n','m',',','.','/'],
			level_4 = ['of','to','in','it','is','be','as','at','so','we']
			level_5 = ['the','and','are','for','not','but','had','has','was','all'],
			block = [null,null,null,null,null,null,null,null,null,null],
			maxBlocksPerGame = 50,
			maxBlocksPerLevel = 10,
			blocksCreated = 0,
			available = [0,1,2,3,4,5,6,7,8,9],
			block_timer = null,
			okToBegin = true;
			drop_increment = 5,
			testString = "";

		/*------------------------------------------------------------------*
		 * Function: 	init()
		 * Contents:	Set up keyboard event listeners.
		 ------------------------------------------------------------------*/
		function init() {
		var gameBoardEl,
			footerEl;
	
			//gameBoardEl = document.getElementById("gameBoard");
			footerEl = document.getElementById("footerId");
			// make some blocks to blow up.
			//set up keyup event listener
			document.addEventListener("keypress",function(e){
				var character = ('charCode' in e)?e.charCode:e.keyCode;

				e.preventDefault();
				processCharacter(String.fromCharCode(character));
				if ((blocksCreated === maxBlocksPerGame) && (available.length ===10)) {
					// Game Over, You win
					clearInterval(block_timer);
					gameOverMsg("Congratulations! You Win! Please click to play again!");
				}
			});

		}
		/*------------------------------------------------------------------*
		 * Function: 	startGame()
		 * Contents:	Begin game play.
		 ------------------------------------------------------------------*/
		function startGame() {
			var i,
				blockTimer=null;

			blocksCreated = 0;
			resetArrays();
			// scramble availabe slots
			scramble(available);
			currentLevel = level_4;
			// start timer to add and move blocks down every second
			block_timer = setInterval(doBlocks,1000);	
		}

		/*------------------------------------------------------------------*
		 * Function: 	doBlocks()
		 * Contents:	Add blocks and move them
		 ------------------------------------------------------------------*/
		function doBlocks() {
			moveBlocks();
			if ((available.length !=0) &&(blocksCreated < maxBlocksPerGame)) {
					addBlock()
			}
		}
		/*------------------------------------------------------------------*
		 * Function: 	gameOverMsg(msg)
		 * Contents:	Display msg then restart the game
		 ------------------------------------------------------------------*/
		function gameOverMsg(msg) {
			modalMsgBox(msg);
		}

		/*------------------------------------------------------------------*
		 * Function: 	resetArrays()
		 * Contents:	Set arrays to default states
		 ------------------------------------------------------------------*/
		function resetArrays() {
	
			for(i=0; i < 10; i+=1) {
				if (block[i] != null) {
						block[i].parentNode.removeChild(block[i]);
				}
				block[i] = null;
				available[i]=i;
			}
		}

		/*------------------------------------------------------------------*
		 * Function: 	moveBlocks()
		 * Contents:	move blocks by changing their top property
		 ------------------------------------------------------------------*/
		function moveBlocks() {
			var i,
				gameOver = false,
				old_bottom;

					for (i=0;i<block.length;i+=1) {
						if(block[i]!=null && !gameOver) {
							old_bottom = parseInt(block[i].style.bottom);
							if ((old_bottom - drop_increment) <= 0) {
								gameOver = true;	
								clearInterval(block_timer);
								gameOverMsg("Sorry, you lost! Please click to try again!");
							} else {
									block[i].style.bottom = (old_bottom -drop_increment) + "%";
							}
							
						}
					}
		}
		/*------------------------------------------------------------------*
		 * Function: 	addBlock()
		 * Contents:	Selects proper slot and content for a block.
		 ------------------------------------------------------------------*/
		function addBlock() {
			var content_length = currentLevel.length,
				block_index,	
				content_index;

			if (blocksCreated < maxBlocksPerLevel) {
				currentLevel = level_1;
			} else if (blocksCreated < maxBlocksPerLevel*2) {
				currentLevel = level_2;
			} else if (blocksCreated < maxBlocksPerLevel*3) {
				currentLevel = level_3;
			} else if (blocksCreated < maxBlocksPerLevel*4) {
				currentLevel = level_4;
			} else if (blocksCreated < maxBlocksPerLevel*5) {
				currentLevel = level_5;
			}
			
			// Unshift 0th available position
			block_index = available.shift();
			// Randomly select the block content from 
			// appropriate lvl array
			// Make the block
			content_index = Math.floor( (Math.random() *(length - 1)));	
			makeBlock(currentLevel[content_index],block_index);
			blocksCreated+=1;
		}

		/*------------------------------------------------------------------*
		 * Function: 	scramble(someArray)
		 * Contents:	scramble elements within an array
		 ------------------------------------------------------------------*/
		function scramble(someArray) {
			var tempEl,
				i,
				swappos;
				length = someArray.length;
			
			for (i=0; i < length;i+=1) {
				swappos = Math.floor( (Math.random() *(length - 1)));	
				tempEl = someArray[i];
				someArray[i] = someArray[swappos];
				someArray[swappos] = tempEl;
			}
		}

		/*------------------------------------------------------------------*
		 * Function: 	processCharacter(character)
		 * Contents:	Determines gameplay based on character pressed.
		 ------------------------------------------------------------------*/
		function processCharacter(character) {
			var i,
				found=false,
				array_length = block.length,
				footerEl;

			footerEl = document.getElementById("footerId");
			if ( character === ' ') {
				testString = "";
				footerEl.innerHTML = "";
			} else {
					testString = testString + character;
					footerEl.innerHTML = testString;
					for(i=0; (i< array_length) && (!found);i+=1) {
						if (block[i] != null) {
							if (block[i].innerHTML === testString) {
								found = true;
								// remove the block and free up the slot
								block[i].parentNode.removeChild(block[i]);
								block[i] = null;
								// add the freed up slot to the available array
								available.push(i); 
								testString = "";
								footerEl.innerHTML = "";
							}
						}
					}
			}
		}

		/*------------------------------------------------------------------*
		 * Function: 	modalMsgBox(msg)
		 * Contents:	Display an overlay and msg box to user.
		 ------------------------------------------------------------------*/
		function modalMsgBox(msg) {
			var overlay,
				mmBox,
				bodyEl = document.body;
				
			overlay = document.createElement("div");
			overlay.className="overlay";
			mmBox = document.createElement("div");
			mmBox.className="msgBox";
			mmBox.innerHTML=msg;
			overlay.appendChild(mmBox);
			bodyEl.appendChild(overlay);
			overlay.addEventListener("click",function () {
				bodyEl.removeChild(overlay);
				startGame();
			});
		}
		/*------------------------------------------------------------------*
		 * Function: 	makeBlock(character,left_post)
		 * Contents:	Create a block containing the stirng the player
		 * 				should type and positioned at one of 10 equidistant
		 * 			 	positions across the width of the viewport.
		 ------------------------------------------------------------------*/
		function makeBlock(character,left_pos) {
			var tempEl = document.createElement("div"),
				board = document.getElementById("gameBoard");

			tempEl.innerHTML = character;
			tempEl.className="block";
			tempEl.style.left = "" + (left_pos*10) + "%";
			tempEl.style.bottom = "" + 85 + "%";
			board.appendChild(tempEl);
			block[left_pos] = tempEl;

		}

		//return the typingGame object interface
		return {
				init:init,
				startGame:startGame
		}
	})();


/*------------------------------------------------------------------*
 * Function: 	
 * Contents:	Initialize the gameboard and set up the event
 * 				listeners for the keyboard.
 ------------------------------------------------------------------*/
window.addEventListener("load",function(){
	typingGame.init();
	typingGame.startGame();
});
