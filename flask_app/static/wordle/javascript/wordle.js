

const allLetter = document.querySelectorAll(".letter");

let user_guest = "";// The user's guest
let wordLengthBeingGuessed = 0;
let numberOfGuess = 0;
let numberOfGuessAllowed = 0;
let isRealWord = false

/**
 * Creates the game board of n x n (n being the length of the word)
 */
function createGameBoard(){
   fetch('/getword', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
    })
    .then(response => response.json())
    .then(data => {
        console.log("CreateGameBoard", data);
        numberOfGuessAllowed = data.wordLength
        let gameBoard = document.getElementById("gameBoard");
        for (let i = 0; i < numberOfGuessAllowed; i++) {
            let row = document.createElement("div");
            row.className = "gridRow";
            for (let j = 0; j < numberOfGuessAllowed; j++) {
                let gridElement = document.createElement("div");
                gridElement.className = "gridElement";
                row.appendChild(gridElement);
            }
            gameBoard.appendChild(row);
        }
    })
}


/**
    To make the popup module go away when the use click close
 */
document.getElementById('close').onclick = function() {
    document.getElementById('popup').style.display = "none";
    createGameBoard()
};

/**
 * Check the user input by taking the ID from HTMl
 * @param user_input_ID the ID from the HTML
 */
function UserInput(user_input_ID){
    console.log("User Input user_input_ID", user_input_ID)

    if(user_input_ID === "Enter"){
        console.log("Enter");
        checkGuess();
        return;
    }

    let gridRow = document.getElementsByClassName('gridRow')[numberOfGuess]
    console.log("game board row",gridRow)

    // Remove letters from the user screen
    if (user_input_ID === "Delete" && wordLengthBeingGuessed > 0 ){
        console.log("Delete");
        wordLengthBeingGuessed--;
        let currentBox = gridRow.children[wordLengthBeingGuessed]
        currentBox.innerText = ""
        user_guest = user_guest.substring(0,user_guest.length-1);
        console.log(user_guest)
        return
    }

    // inserret the letter int the  Grid
    if(wordLengthBeingGuessed <= numberOfGuessAllowed && user_input_ID !== "Delete" ){
        let currentBox = gridRow.children[wordLengthBeingGuessed]
        currentBox.innerText = user_input_ID
        wordLengthBeingGuessed++;
        user_guest += user_input_ID
    }
}
/**
    Goes through and adds an event lister to each letter to see if it as been clicked
 */
allLetter.forEach( letter => {
    letter.addEventListener("click",()=>{
        UserInput(letter.id);
    })
});
/**
    Take the input from the keyboard
 */
document.addEventListener("keydown",function (ev){
    if(ev.key.toUpperCase() === "BACKSPACE"){
        UserInput(document.getElementById("Delete").textContent);
    }else if(ev.key.toUpperCase() === "ENTER"){
        UserInput(document.getElementById('Enter').textContent);
    }else if(wordLengthBeingGuessed <= numberOfGuessAllowed){
        UserInput(document.getElementById(ev.key.toUpperCase()).textContent);
    }
});


/**
 * Check the user guess by the seeing if all the grid element have been filled, if it is a real word
 * also if it is the correct word
 * @returns {Promise<void>}
 */
async function checkGuess(){

     console.log("Check Guess")

    if(!checkWordLength()){
        console.log("word to short")
        return;
    }
    await realWord()
    console.log("realword fin")
    console.log("isRealWord",isRealWord)
    if(!isRealWord){
        console.log("Not a real word")
        notRealWordText()
        return;
    }else if(document.getElementById('notRealWord')){
        while(document.getElementById('notRealWord')){
            document.getElementById('notRealWord').remove()
        }
    }

    const guessData = {
        guess: user_guest,
    };
    // Make an AJAX request to the server to make sure that ithe
    fetch('/checkWord', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(guessData),
    })
    .then(response => response.json())
    .then(data => {
        console.log("data",data);
        newGridColor = data.newGridColor
        let gridRow = document.getElementsByClassName('gridRow')[numberOfGuess]

        for(let i = 0; i < wordLengthBeingGuessed;i++){
            gridRow.children[i].style.backgroundColor = newGridColor[i];
            console.log(document.getElementById(user_guest[i]))
            document.getElementById(user_guest[i]).style.backgroundColor = newGridColor[i];
        }

        user_guest = "";
        numberOfGuess ++;
        wordLengthBeingGuessed = 0;

        showScoreboard(data.correctWord);
    });
}

/**
 * Check to see if the user input a real word
 * @returns {Promise<any>}
 */
function realWord() {
    const UserWord = {
        guess: user_guest,
    };

    return fetch('/realWord', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(UserWord),
    })
    .then(response => response.json())
    .then(data => {
        console.log("data realWord ", data.isWord);
        isRealWord = data.isWord === true;
    });
}

/**
 * Show text on the screen saying that the user input was invaled
 */
function notRealWordText(){
    if(document.getElementById('notRealWordContainer')) {
        let notRealWordMessage = document.createElement("p");
        notRealWordMessage.id = "notRealWord"
        notRealWordMessage.textContent = "This word does not exist please try another one";

        let notRealWordContainer = document.getElementById("notRealWordContainer");
        notRealWordContainer.appendChild(notRealWordMessage);
    }else{
        while(document.getElementById('notRealWord')){
            document.getElementById('notRealWord').remove()
        }
    }
}

/**
 * If the user input was not long enough tell the user to fill all the boxs
 * @returns {boolean}
 */
function checkWordLength(){
    if(wordLengthBeingGuessed < numberOfGuessAllowed) {
        let shortWordMessage = document.createElement("p");
        shortWordMessage.id = "wordToShort"
        shortWordMessage.textContent = "The word is too short. Please make sure all the boxes are filled.";

        let shortWordContainer = document.getElementById("shortWord");
        shortWordContainer.appendChild(shortWordMessage);
        console.log()
        return false
    }else if(document.getElementById("wordToShort")) {
        while(document.getElementById("wordToShort")){
            document.getElementById("wordToShort").remove()
        }
    }
    return true
}

/**
 * Shows the score board if the user guess to many times or guessed the word right
 * @param corretWord if the word it correct
 */
function showScoreboard(corretWord){
    console.log(corretWord)
    if(numberOfGuess === numberOfGuessAllowed || corretWord === true){
        // display the score board and turn of the event listerns
        document.getElementById("gameBoard").remove()

        const UserScore = {
            score: numberOfGuess,
            addToScore: corretWord
        };
        fetch('/Scoreboard', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
            body: JSON.stringify(UserScore),
        })
        .then(response => response.json())
        .then(data => {

            scoreBoard = document.getElementById("scoreBoard");
            hiddenWord = document.createElement("h3");
            hiddenWord.id = "secretWord";
            hiddenWord.append(data.HiddenWord);
            scoreBoard.appendChild(hiddenWord);
            for(let i = 0; i < Math.min(5, data.TopFiveScores.length);i++){
                let scores = document.createElement("li")
                scores.className = "topScores";
                scores.append("User : " + data.TopFiveScores[i].user_name + " Score: " + data.TopFiveScores[i].score )
                scoreBoard.appendChild(scores)
            }

        })
    }
}
