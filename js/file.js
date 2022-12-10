 /*
----------------------------------------------------------------------------------
Objects and variables
----------------------------------------------------------------------------------
Store current and total scores.
*/

const aluno = {
    name: '',
    words_learned: 0,
    words_right: 0,
    words_total: 0
}

let logMessage = ''; // stores correct and incorrect values during the quiz

/* 
----------------------------------------------------------------------------------
Labels
----------------------------------------------------------------------------------
Labels that will store the student's data.
*/ 

// Student data

let studentLearnedWords = $('#learned-words');
let pastSimpleCheckbox = $('#include-past-simple');
let pastParticipleCheckbox = $('#include-past-participle');

/* 
----------------------------------------------------------------------------------
Auxiliary functions (togglePastSimple() / togglePastParticiple())
----------------------------------------------------------------------------------
Activated when labels are clicked. If both are unchecked, check the other one.
*/ 

function togglePastSimple(){
    if(!pastSimpleCheckbox.prop("checked") && !pastParticipleCheckbox.prop("checked")){
        pastParticipleCheckbox.prop("checked", "true");
    }
}

function togglePastParticiple(){
    if(!pastSimpleCheckbox.prop("checked") && !pastParticipleCheckbox.prop("checked")){
        pastSimpleCheckbox.prop("checked", "true");
    }
}

// Message board

let messageBoard = $('#message');

// Quiz area

let wordNumber = $('#word-no');
let correctPct = $('#correct-pct');
let infinitiveAnswer = $('#answer-infinitive');
let pastSimpleAnswer = $('#answer-past-simple');
let pastParticipleAnswer = $('#answer-past-participle');
let allLabels = $('.answers');
console.log(allLabels)

// Update functions

function updateStudentScore(){
    if(aluno.words_total === 0){
        correctPct.text("0.00");
    }
    else{
        correctPct.text((aluno.words_right / aluno.words_total * 100).toFixed(2)); 
    } 
}

/* 
----------------------------------------------------------------------------------
The verbs
----------------------------------------------------------------------------------
This part of the program reuses its desktop version in which the list of verbs is
read from a .txt file. Instead, it will be directly loaded here. 
*/ 

class verb {
    constructor(infinitive, past_simple, past_participle, isTaken){
        this._infinitive = infinitive;
        this._past_simple = past_simple;
        this._past_participle = past_participle;
        this._taken = isTaken;       
    }

    get infinitive(){
        return this._infinitive;
    }

    get pastSimple(){
        return this._past_simple;
    }

    get pastParticiple(){
        return this._past_participle;
    }

    get taken(){
        return this._taken;
    }

    set taken(newTaken){
        this._taken = newTaken;
    }
}

/*
----------------------------------------------------------------------------------
Initializing list of verbs
----------------------------------------------------------------------------------
Here, verbs are already inside the program's data structures. The program sets
the attribute taken to false, meaning that the student has not answered a question
about that particular verb. When it happens, the value will be set to true.
*/

function resetVerbList(theListOfVerbs){
    theListOfVerbs.forEach(
        function(theVerb){
            theVerb.taken = false;
        }
    );
}

function resetStudentScore(){
    aluno.words_right = 0;
    aluno.words_total = 0;
}

let shuffledIndex = 0; // Initialize shuffled number

function shuffleVerb(currentListOfVerbs, currentWordCount){
    // Shuffled number is a number between 0 and the end of the verb array (excluding verbs already taken)
    // the number of verbs that were already taken is the current wordCount - 1.
    let takenVerbs = Number(currentWordCount.text()) - 1;
    console.log('Word count = ' + takenVerbs);
    let shuffledNumber = Math.floor(Math.random() * (Number(studentLearnedWords.val()) - takenVerbs)); 
    console.log('shuffled number = ' + shuffledNumber);
    // Scan the whole list of verbs to point to a non-taken verb in sorted position
    for(let i = 0; i < shuffledNumber || currentListOfVerbs[i].taken === true ; i++){
        if(currentListOfVerbs[i].taken === true){
            shuffledNumber++;
        }
    }
    console.log('shuffled index = ' + shuffledNumber);

    // tell list of verbs that this particular verb was taken
    currentListOfVerbs[shuffledNumber].taken = true;
    return shuffledNumber;
}

function showInfinitive(theInfinitive, thePastSimple, thePastParticiple, theListOfVerbs, theIndex){
    theInfinitive.text(theListOfVerbs[theIndex].infinitive);
    thePastSimple.val("");
    thePastParticiple.val("");
}

function showPast(theInfinitive, thePastSimple, thePastParticiple, theListOfVerbs, theIndex){
    let theMessage = messageBoard.text() +
    '(' + theListOfVerbs[theIndex].infinitive + ' - ' + theListOfVerbs[theIndex].pastSimple + ' - ' + theListOfVerbs[theIndex].pastParticiple + ')';

    messageBoard.text(theMessage);
}

console.log(listOfVerbs);

let startBtn = $('#btn-start');
startBtn.click(function(){
    // Only start the quiz if there is a list of verbs loaded to the system.
    if(listOfVerbs.length > 0){
        wordNumber.text(1);
        resetVerbList(listOfVerbs);
        // Initialize score
        resetStudentScore();
        updateStudentScore();
        logMessage = 'QUIZ LOG:';
        if(studentLearnedWords.val() < 1){
            // invalid number of learned words
            studentLearnedWords.val(1);
        }else if(studentLearnedWords.val() > listOfVerbs.length){
            // invalid number of learned words
            studentLearnedWords.val(listOfVerbs.length);
        }

        stateMachine(states.QUIZ_STARTED_NO_ANSWER);
    }
    else{
        alert('Cannot start quiz because there are no verbs to be shown. Load a valid list of verbs to the application.');
    }
    
});

/*
----------------------------------------------------------------------------------
isCorrect
----------------------------------------------------------------------------------
This function breaks the answer found in the verb list in the possible answers
that will be accepted as true and checks if any of them matches the user's answer.
Ex: got/gotten will compare the user's response to both got and gotten.
*/

function isCorrectPastSimple(userPastSimple, programPastSimple){
    // In case the program is not checking past simple, say it is correct. 
    if(pastSimpleCheckbox.prop("checked") == false){
        return true;
    }
    let correctPastSimple = programPastSimple.split('/'); // all possibilities for past simple
    for(let i = 0; i < correctPastSimple.length; i++){
        if (userPastSimple === correctPastSimple[i]){
            return true;
        }
    }
    return false;
}

function isCorrectPastParticiple(userPastParticiple, programPastParticiple){
    // In case the program is not checking past participle, say it is correct. 
    if(pastParticipleCheckbox.prop("checked") == false){
        return true;
    }
    let correctPastParticiple = programPastParticiple.split('/'); // all possibilities for past simple
    for(let i = 0; i < correctPastParticiple.length; i++){
        if (userPastParticiple === correctPastParticiple[i]){
            return true;
        }
    }
    return false;
}

function correctWord(){
    aluno.words_right ++;
    aluno.words_total ++;
    console.log(aluno);
    updateStudentScore();
    let row = $("<tr>");
    let columnInfinitive = $("<td>").text(infinitiveAnswer.text());
    let columnPastSimple = $("<td>").text(pastSimpleAnswer.val().toLowerCase());
    let columnPastParticiple = $("<td>").text(pastParticipleAnswer.val().toLowerCase());
    let columnStatus = $("<td>").text("correct");
    columnStatus.addClass("correctAnswer");

    row.append(columnInfinitive);
    row.append(columnPastSimple);
    row.append(columnPastParticiple);
    row.append(columnStatus);

    $("#quiz-log-table").find("tbody").append(row);

};

function incorrectWord(pastSimpleCorrect, pastParticipleCorrect){
    aluno.words_total ++;
    console.log(aluno);
    updateStudentScore();

    let row = $("<tr>");
    
    let columnInfinitive = $("<td>").text(infinitiveAnswer.text());
    
    let columnPastSimple = $("<td>").text(pastSimpleAnswer.val().toLowerCase());
    if(!pastSimpleCorrect){
        columnPastSimple.addClass("incorrectAnswer");
    }

    let columnPastParticiple = $("<td>").text(pastParticipleAnswer.val().toLowerCase());
    if(!pastParticipleCorrect){
        columnPastParticiple.addClass("incorrectAnswer");
    }
    
    let columnStatus = $("<td>").text("incorrect");
    columnStatus.addClass("incorrectAnswer");

    row.append(columnInfinitive);
    row.append(columnPastSimple);
    row.append(columnPastParticiple);
    row.append(columnStatus);

    $("#quiz-log-table").find("tbody").append(row);

};

let showAnsBtn = $('#btn-show-answer');
showAnsBtn.click(showAnswer);


function showAnswer(){
    // separate answer to see exactly which are incorrect, if any.
    // this will be used to color Quiz Log.

    console.log(listOfVerbs);

    let pastSimpleCorrect = isCorrectPastSimple(pastSimpleAnswer.val().toLowerCase(), listOfVerbs[shuffledIndex].pastSimple);
    
    let pastParticipleCorrect = isCorrectPastParticiple(pastParticipleAnswer.val().toLowerCase(), listOfVerbs[shuffledIndex].pastParticiple);

    // Signal to the state machine that answer was shown
    if( pastSimpleCorrect && pastParticipleCorrect ) {
    correctWord();
    stateMachine(states.QUIZ_STARTED_ANSWER_CORRECT);
    }else{
    incorrectWord(pastSimpleCorrect, pastParticipleCorrect);
    stateMachine(states.QUIZ_STARTED_ANSWER_INCORRECT);
    }
}

function nextWord(){
    // Check if all words were already taken. No new words to show.
    if(aluno.words_total >= Number(studentLearnedWords.val()))
    {
        stateMachine(states.NO_MORE_WORDS);
    } else{
        wordNumber.text(aluno.words_total + 1);
        stateMachine(states.QUIZ_STARTED_NO_ANSWER);
    }
}

// showAnsBtn is equivalent to pressing enter in the input boxes
// nextWord() will be useful in future version of the game in which input boxes will be visible
// together with the right or wrong message

pastSimpleAnswer.keydown(search);
pastParticipleAnswer.keydown(search);

function search(pressedKey){
    if(pressedKey.key === 'Enter'){
        if(
            showAnsBtn.prop("disabled") == false &&
            pastSimpleAnswer.val().length > 0 &&
            pastParticipleAnswer.val().length > 0
        ){
            showAnswer();
        }
    }
}

let endQuizBtn = $('#btn-end');
endQuizBtn.click(function(){
    if(true){
        stateMachine(states.NO_MORE_WORDS);
    }    
});

/* 
----------------------------------------------------------------------------------
Program resetting
----------------------------------------------------------------------------------
The program erases all data and becomes prepared to a new quiz.
*/ 

const resetBtn = $('#btn-reset');
resetBtn.click(function(){
    stateMachine(states.STUDENT_REGISTERED);
    wordNumber.text(0);
    infinitiveAnswer.text("");
    pastSimpleAnswer.val("");
    pastParticipleAnswer.val("");
    resetStudentScore();
    updateStudentScore();
});

/* 
----------------------------------------------------------------------------------
Clearing all labels
----------------------------------------------------------------------------------
The program shifts between answer labels to be visible and invisible. This is meant
so the message board and the answer labels can occupy the same space to optimize
space (especially in smartphones)
*/ 
function setLabelVisibility(visibilityMode){
    for(let i = 0; i < allLabels.length; i++){
        allLabels[i].style.visibility = visibilityMode;
    }
}

/* 
----------------------------------------------------------------------------------
State Machine
----------------------------------------------------------------------------------
This part of the code configures every button that must be activated or
deactivated depending on the program's state to prevent users from activating
forbidden functions (like starting a quiz without a verb list).
*/ 

const states = {
    STUDENT_REGISTERED: 'student-registered',
    QUIZ_STARTED_NO_ANSWER: 'quiz-started-no-answer', 
    QUIZ_STARTED_ANSWER_CORRECT: 'quiz-started-answer-correct',
    QUIZ_STARTED_ANSWER_INCORRECT: 'quiz-started-answer-incorrect',
    NO_MORE_WORDS: 'no-more-words'
};

stateMachine(states.STUDENT_REGISTERED);

function stateMachine(currentState){
    if(!currentState){
        throw new Error('State is not defined');
    }
    switch(currentState){
        case states.STUDENT_REGISTERED:
            $("#quiz-log-table").slideUp(500);
            $("#quiz-log-table").find("tbody").empty();

            setLabelVisibility('collapse'); // Hide verbs. Message Board is showing a message
            showMessage('Choose how many words from the list you already know in the "learned words" box and start the quiz anytime.');
            studentLearnedWords.prop("disabled", false);
            startBtn.prop("disabled", false);
            startBtn.css("background-color","#DDDD00");
            showAnsBtn.prop("disabled", true);
            showAnsBtn.css("background-color","#555500");
            resetBtn.prop("disabled", true);
            resetBtn.css("background-color","#555500");
            endQuizBtn.prop("disabled", true);
            endQuizBtn.css("background-color","#555500");
            pastSimpleCheckbox.prop("checked", true);
            pastParticipleCheckbox.prop("checked", true);
            pastSimpleCheckbox.prop("disabled", false);
            pastParticipleCheckbox.prop("disabled", false);
            break;
        case states.QUIZ_STARTED_NO_ANSWER:
            setLabelVisibility('visible'); // Show verbs. Student needs to write the answers
            showMessage('');
            shuffledIndex = shuffleVerb(listOfVerbs, wordNumber);
            console.log(shuffledIndex);
            showInfinitive(infinitiveAnswer, pastSimpleAnswer, pastParticipleAnswer, listOfVerbs, shuffledIndex);
            studentLearnedWords.prop("disabled", true);
            startBtn.prop("disabled", true);
            startBtn.css("background-color", "#555500");
            showAnsBtn.prop("disabled", false);
            showAnsBtn.css("background-color", "#DDDD00");
            resetBtn.prop("disabled", false);
            resetBtn.css("background-color", "#DDDD00");
            endQuizBtn.prop("disabled", false);
            endQuizBtn.css("background-color", "#DDDD00");
            pastSimpleCheckbox.prop("disabled", true);
            pastParticipleCheckbox.prop("disabled", true);
            if(pastSimpleCheckbox.prop("checked") == false){
                pastSimpleAnswer.val("---");
                pastSimpleAnswer.prop("disabled", true);
            }else{
                pastSimpleAnswer.prop("disabled", false);
            }
            if(pastParticipleCheckbox.prop("checked") == false){
                pastParticipleAnswer.val("---");
                pastParticipleAnswer.prop("disabled", true);
            }else{
                pastParticipleAnswer.prop("disabled", false);
            }
            pastSimpleAnswer.focus();
            break;
        case states.QUIZ_STARTED_ANSWER_CORRECT:
            setLabelVisibility('collapse'); // Hide verbs. Message Board is showing a message
            showMessage('Congratulations! Your answer is correct. Next word in 3 seconds...');
            showPast(infinitiveAnswer, pastSimpleAnswer, pastParticipleAnswer, listOfVerbs, shuffledIndex);
            studentLearnedWords.prop("disabled", true);
            startBtn.prop("disabled", true);
            startBtn.css("background-color", "#555500");
            showAnsBtn.prop("disabled", true);
            showAnsBtn.css("background-color", "#555500");
            resetBtn.prop("disabled", false);
            resetBtn.css("background-color", "#DDDD00");
            endQuizBtn.prop("disabled", false);
            endQuizBtn.css("background-color", "#DDDD00");
            waitForNextWord(3);
            break;
        case states.QUIZ_STARTED_ANSWER_INCORRECT:
            setLabelVisibility('collapse'); // Hide verbs. Message Board is showing a message
            showMessage('Unfortunately, your answer is incorrect. Click on NEXT WORD to proceed.');
            showPast(infinitiveAnswer, pastSimpleAnswer, pastParticipleAnswer, listOfVerbs, shuffledIndex);
            studentLearnedWords.prop("disabled", true);
            startBtn.prop("disabled", true);
            startBtn.css("background-color", "#555500");
            showAnsBtn.prop("disabled", true);
            showAnsBtn.css("background-color", "#555500");
            resetBtn.prop("disabled", false);
            resetBtn.css("background-color", "#DDDD00");
            endQuizBtn.prop("disabled", false);
            endQuizBtn.css("background-color", "#DDDD00");
            waitForNextWord(3);
            break;
        case states.NO_MORE_WORDS:
            $("#quiz-log-table").slideDown(500);
            scrollQuizLog(500);
                
            setLabelVisibility('collapse'); // Hide verbs. Message Board is showing a message
            let messageToBeShown = 'Your score: ' + aluno.words_right + ' words out of ' + aluno.words_total + '. ';
            if(aluno.words_right / aluno.words_total < 0.6){
                messageToBeShown = messageToBeShown.concat('Keep working on your list. You will soon memorize a lot of words!');
            }else if(aluno.words_right / aluno.words_total < 0.9){
                messageToBeShown = messageToBeShown.concat('You have done a great job! You learned many words from the list!');
            }else{
                messageToBeShown = messageToBeShown.concat('Your memorization skills are impressive! You should consider adding more verbs to your list.');
            }
            messageToBeShown = messageToBeShown.concat('\nThe End. \nPress RESET QUIZ to create a new quiz.');           
            showMessage(messageToBeShown); 
            studentLearnedWords.prop("disabled", true);
            startBtn.prop("disabled", true);
            startBtn.css("background-color", "#555500");
            showAnsBtn.prop("disabled", true);
            showAnsBtn.css("background-color", "#555500");
            resetBtn.prop("disabled", false);
            resetBtn.css("background-color", "#DDDD00");
            endQuizBtn.prop("disabled", true);
            endQuizBtn.css("background-color", "#555500");
            break;
    }  
}

function showMessage(message){
    messageBoard.empty();
    message = message.split('\n');
    message.forEach(function(sentence){
        let messageText = $("<div>").text(sentence);
        messageText.addClass("messageBoardText");
        messageBoard.append(messageText);
    });
}

function waitForNextWord(time){
    resetBtn.prop("disabled", true);
    resetBtn.css("background-color", "#555500");
    endQuizBtn.prop("disabled", true);
    endQuizBtn.css("background-color", "#555500");
    let seconds = $("<div>").text(time + "...");
    seconds.addClass("timer");
    messageBoard.append(seconds);
    let timer = setInterval(function(){
        time--;
        seconds.text(time + "...");
        if(time<1){
            clearInterval(timer);
            seconds.remove();
            nextWord();
        }
    }, 1000);
}

function scrollQuizLog(duration) {
    let position = $("#quiz-log-table").offset().top;
    $("html").animate({
        scrollTop: position + "px"
    }, duration);
}