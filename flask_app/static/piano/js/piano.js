


/* all the keys */
const showKeys = document.getElementById("Keys");
/* white keys  */
const white = document.querySelectorAll(".white");
/* black keys  */
const blackKey = document.querySelectorAll(".black");
/* The sound files when the use hits the keys   */
const soundFiles = {65:"http://carolinegabriel.com/demo/js-keyboard/sounds/040.wav",
                87:"http://carolinegabriel.com/demo/js-keyboard/sounds/041.wav",
                83:"http://carolinegabriel.com/demo/js-keyboard/sounds/042.wav",
                69:"http://carolinegabriel.com/demo/js-keyboard/sounds/043.wav",
                68:"http://carolinegabriel.com/demo/js-keyboard/sounds/044.wav",
                70:"http://carolinegabriel.com/demo/js-keyboard/sounds/045.wav",
                84:"http://carolinegabriel.com/demo/js-keyboard/sounds/046.wav",
                71:"http://carolinegabriel.com/demo/js-keyboard/sounds/047.wav",
                89:"http://carolinegabriel.com/demo/js-keyboard/sounds/048.wav",
                72:"http://carolinegabriel.com/demo/js-keyboard/sounds/049.wav",
                85:"http://carolinegabriel.com/demo/js-keyboard/sounds/050.wav",
                74:"http://carolinegabriel.com/demo/js-keyboard/sounds/051.wav",
                75:"http://carolinegabriel.com/demo/js-keyboard/sounds/052.wav",
                79:"http://carolinegabriel.com/demo/js-keyboard/sounds/053.wav",
                76:"http://carolinegabriel.com/demo/js-keyboard/sounds/054.wav",
                80:"http://carolinegabriel.com/demo/js-keyboard/sounds/055.wav",
                186:"http://carolinegabriel.com/demo/js-keyboard/sounds/056.wav"};
/* is the mouse in the screen */
let inScreen = false;
/* log all the user inputs */
let monster='';
/* Can the user hit the keys */
let keysPlayable = true;

/*
    The letter on the keyboard to let the user know which ones to press. When the
    cursor has entered the screen
*/
showKeys.addEventListener("mouseenter", (event) => {
    for (let i = 0; i < white.length; i++ ){
        white[i].style.color = '#000000';
    }
    for (let i = 0; i < blackKey.length; i++ ){
        blackKey[i].style.color = '#FFFFFF';
    }
    inScreen = true;
  },
);

/*
    Hide lettering of the keyboard when mouse is moved away from the piano
*/
showKeys.addEventListener("mouseleave", (event) => {
    // highlight the mouseenter target
   for (let i = 0; i < white.length; i++ ){
        white[i].style.color = '#FFFFFF';
    }
    for (let i = 0; i < blackKey.length; i++ ){
        blackKey[i].style.color = '#000000';
    }
    inScreen = false;
  },
);
/*
    When the "weseeyou" is typed on the keyboard fades the piano out. Replace it
    with an image as well plays new sound. Also disables the piano from being used anymore
*/
function awakenMonster(monster){
    if (monster.slice(-8) === "weseeyou" && keysPlayable){
        console.log("monster woken");
        sound = "https://orangefreesounds.com/wp-content/uploads/2020/09/Creepy-piano-sound-effect.mp3?_=1"
        let playSound = new Audio(sound);
        playSound.play();

        let img = document.createElement('img');
        img.src = "/static/piano/images/texture.jpeg";
        img.alt = "creepy image";

        img.classList.add("monster");

        document.getElementById('pianoBackground').appendChild(img);

        //The better way but can't be done since document.body not a function
        //document.body.removeEventListener("keydown",test);
        keysPlayable = false;
    }
}

/*
    Takes the user inputs and shows what keys are being pressed at that time by changing
    the background colors. In additions, it will play the sound that key makes
*/
document.body.addEventListener("keydown",(ev)=>{
    let notesId;
    let sound;
    monster += ev.key;
    console.log(monster);
    awakenMonster(monster);
    // get the key and not that needs to be played
    if (keysPlayable) {
        if (ev.key === "a" || ev.key === "A") {
            notesId = document.getElementById("A");
            sound = soundFiles[65];
        }
        if (ev.key === "w" || ev.key === "W") {
            notesId = document.getElementById("W");
            sound = soundFiles[87];
        }
        if (ev.key === "d" || ev.key === "D") {
            notesId = document.getElementById("D");
            sound = soundFiles[68];
        }
        if (ev.key === "s" || ev.key === "S") {
            notesId = document.getElementById("S");
            sound = soundFiles[83];
        }
        if (ev.key === "e" || ev.key === "E") {
            notesId = document.getElementById("E");
            sound = soundFiles[69];
        }
        if (ev.key === "f" || ev.key === "F") {
            notesId = document.getElementById("F");
            sound = soundFiles[70];
        }
        if (ev.key === "t" || ev.key === "T") {
            notesId = document.getElementById("T");
            sound = soundFiles[84];
        }
        if (ev.key === "g" || ev.key === "G") {
            notesId = document.getElementById("G");
            sound = soundFiles[71];
        }
        if (ev.key === "y" || ev.key === "Y") {
            notesId = document.getElementById("Y");
            sound = soundFiles[89];
        }
        if (ev.key === "h" || ev.key === "H") {
            notesId = document.getElementById("H");
            sound = soundFiles[72];
        }
        if (ev.key === "u" || ev.key === "U") {
            notesId = document.getElementById("U");
            sound = soundFiles[85];
        }
        if (ev.key === "j" || ev.key === "J") {
            notesId = document.getElementById("J");
            sound = soundFiles[74];
        }
        if (ev.key === "k" || ev.key === "K") {
            notesId = document.getElementById("K");
            sound = soundFiles[75];
        }
        if (ev.key === "o" || ev.key === "O") {
            notesId = document.getElementById("O");
            sound = soundFiles[79];
        }
        if (ev.key === "l" || ev.key === "L") {
            notesId = document.getElementById("L");
            sound = soundFiles[76];
        }
        if (ev.key === "p" || ev.key === "P") {
            notesId = document.getElementById("P");
            sound = soundFiles[80];
        }
        if (ev.key === ";") {
            notesId = document.getElementById("Colon");
            sound = soundFiles[186];
        }
        //plays sounds and changes the background color
        let playSound = new Audio(sound);
        playSound.play();
        changeBackgroundColor(notesId);
    }
},
);
/*
* How long to change the background colors of the keys
* */
function changeBackgroundColor(notesID){
    notesID.style.background = '#ff0000';
    notesID.style.color = '#ff0000';
    setTimeout(() => {
        notesID.style.background = '';
         notesID.style.color = '';
    }, 100);
}







// const keys  = document.querySelectorAll(".key"),
//       note  = document.querySelector(".nowplaying"),
//       hints = document.querySelectorAll(".hints");
//       doom  = 0;
// var   array = [];
//
//
//
// const scary = "https://orangefreesounds.com/wp-content/uploads/2020/09/Creepy-piano-sound-effect.mp3?_=1"
//
// const sound = {65:"http://carolinegabriel.com/demo/js-keyboard/sounds/040.wav",
//                87:"http://carolinegabriel.com/demo/js-keyboard/sounds/041.wav",
//                83:"http://carolinegabriel.com/demo/js-keyboard/sounds/042.wav",
//                69:"http://carolinegabriel.com/demo/js-keyboard/sounds/043.wav",
//                68:"http://carolinegabriel.com/demo/js-keyboard/sounds/044.wav",
//                70:"http://carolinegabriel.com/demo/js-keyboard/sounds/045.wav",
//                84:"http://carolinegabriel.com/demo/js-keyboard/sounds/046.wav",
//                71:"http://carolinegabriel.com/demo/js-keyboard/sounds/047.wav",
//                89:"http://carolinegabriel.com/demo/js-keyboard/sounds/048.wav",
//                72:"http://carolinegabriel.com/demo/js-keyboard/sounds/049.wav",
//                85:"http://carolinegabriel.com/demo/js-keyboard/sounds/050.wav",
//                74:"http://carolinegabriel.com/demo/js-keyboard/sounds/051.wav",
//                75:"http://carolinegabriel.com/demo/js-keyboard/sounds/052.wav",
//                79:"http://carolinegabriel.com/demo/js-keyboard/sounds/053.wav",
//                76:"http://carolinegabriel.com/demo/js-keyboard/sounds/054.wav",
//                80:"http://carolinegabriel.com/demo/js-keyboard/sounds/055.wav",
//                186:"http://carolinegabriel.com/demo/js-keyboard/sounds/056.wav"};
//
// // ------------------------------------------------------------------------
// // Listens for a change to the pressed key, and updates the hidden phrase.
// // ------------------------------------------------------------------------
// note.addEventListener('DOMSubtreeModified', function(){
//   const result = note.innerHTML;
//   array += result;
//
//   if (array.length > 8) {
//     array = array.slice(1,9);
//     }
//   console.log('The array'); console.log(array);
//
//   if (array === "WESEEYOU" && doom === 0){
//     doom = 1;
//     document.querySelector(".bkgdc").style.opacity=0;
//     document.querySelector(".bgimg").style.opacity=1;
//     document.querySelector(".keys").style.opacity=0;
//
//
//     const audio = new Audio(scary);
//     audio.currentTime = 0;
//     audio.play();
//     document.getElementById("message").innerHTML = "I have awoken."
//     }
// });
//
// // ------------------------------------------------------------------------
// // We use an e here because we selected a set of KEYS!
// // ------------------------------------------------------------------------
// function playNote(e) {
//   //console.log(e);
//
//   if (doom === 1) return;
//
//   console.log(e.keyCode);
//
//   const key = document.querySelector(`.key[data-key="${e.keyCode}"]`);
//   if (!key) return;
//   const keyPressed = key.firstChild.innerHTML;
//
//   key.classList.add("playing");
//   note.innerHTML = keyPressed;
//
//   // play the audio
//   const audio = new Audio(sound[e.keyCode]);
//   audio.currentTime = 0;
//   audio.play();
//
// }
//
// function removeTransition(e) {
//   if (e.propertyName !== "transform") return;
//   this.classList.remove("playing");
// }
//
// // -------------------------------------------------------------------------
// // FOR THE HINTS
// // --------------------------------------------------------------------------
// function hintsOn(e, index) {
//   //console.log(e)
//   console.log(e.fromElement.id)
//   const key = document.querySelector(`.key[data-key="${e.fromElement.id}"]`);
//   key/
//   console.log(key)
//   if (!key) return;
//
//   key.setAttribute("background", "red")
//   key.setAttribute("style", "transition-delay:" + 50 + "ms");
// }
//
// //hints.forEach(hintsOn);
// keys.forEach(key => key.addEventListener("transitionend", removeTransition));
//
// //This is what binds 'e'.
// window.addEventListener("keydown", playNote);
// window.addEventListener("mouseover", hintsOn);
//
//
