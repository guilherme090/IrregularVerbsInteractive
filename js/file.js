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
Auxiliary functions (togglePastSimple() / togglePastParticiple())
----------------------------------------------------------------------------------
Activated when labels are clicked. If both are unchecked, check the other one.
*/ 

function togglePastSimple(){
    if(!$('#include-past-simple').prop("checked") && !$('#include-past-participle').prop("checked")){
        $('#include-past-participle').prop("checked", "true");
    }
}

function togglePastParticiple(){
    if(!$('#include-past-simple').prop("checked") && !$('#include-past-participle').prop("checked")){
        $('#include-past-simple').prop("checked", "true");
    }
}

// Update functions

function updateStudentScore(){
    if(aluno.words_total === 0){
        $('#correct-pct').text("0.00");
    }
    else{
        $('#correct-pct').text((aluno.words_right / aluno.words_total * 100).toFixed(2)); 
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
    let shuffledNumber = Math.floor(Math.random() * (Number($('#learned-words').val()) - takenVerbs)); 
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
    let theMessage = $('#message').text() +
    '(' + theListOfVerbs[theIndex].infinitive + ' - ' + theListOfVerbs[theIndex].pastSimple + ' - ' + theListOfVerbs[theIndex].pastParticiple + ')';

    $('#message').text(theMessage);
}

console.log(listOfVerbs);

$('#btn-start').click(function(){
    // Only start the quiz if there is a list of verbs loaded to the system.
    if(listOfVerbs.length > 0){
        $('#word-no').text(1);
        resetVerbList(listOfVerbs);
        // Initialize score
        resetStudentScore();
        updateStudentScore();
        logMessage = 'QUIZ LOG:';
        if($('#learned-words').val() < 1){
            // invalid number of learned words
            $('#learned-words').val(1);
        }else if($('#learned-words').val() > listOfVerbs.length){
            // invalid number of learned words
            $('#learned-words').val(listOfVerbs.length);
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
    if($('#include-past-simple').prop("checked") == false){
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
    if($('#include-past-participle').prop("checked") == false){
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
    let columnInfinitive = $("<td>").text($('#answer-infinitive').text());
    let columnPastSimple = $("<td>").text($('#answer-past-simple').val().toLowerCase());
    let columnPastParticiple = $("<td>").text($('#answer-past-participle').val().toLowerCase());
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
    
    let columnInfinitive = $("<td>").text($('#answer-infinitive').text());
    
    let columnPastSimple = $("<td>").text($('#answer-past-simple').val().toLowerCase());
    if(!pastSimpleCorrect){
        columnPastSimple.addClass("incorrectAnswer");
        $("#answer-past-simple").addClass("wrongAnswerHighlight");
    }

    let columnPastParticiple = $("<td>").text($('#answer-past-participle').val().toLowerCase());
    if(!pastParticipleCorrect){
        columnPastParticiple.addClass("incorrectAnswer");
        $("#answer-past-participle").addClass("wrongAnswerHighlight");
    }
    
    let columnStatus = $("<td>").text("incorrect");
    columnStatus.addClass("incorrectAnswer");

    row.append(columnInfinitive);
    row.append(columnPastSimple);
    row.append(columnPastParticiple);
    row.append(columnStatus);

    $("#quiz-log-table").find("tbody").append(row);

};

$('#btn-show-answer').click(showAnswer);

function showAnswer(){
    // separate answer to see exactly which are incorrect, if any.
    // this will be used to color Quiz Log.

    console.log(listOfVerbs);

    let pastSimpleCorrect = isCorrectPastSimple($('#answer-past-simple').val().toLowerCase(), listOfVerbs[shuffledIndex].pastSimple);
    
    let pastParticipleCorrect = isCorrectPastParticiple($('#answer-past-participle').val().toLowerCase(), listOfVerbs[shuffledIndex].pastParticiple);

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
    if(aluno.words_total >= Number($('#learned-words').val()))
    {
        stateMachine(states.NO_MORE_WORDS);
    } else{
        $('#word-no').text(aluno.words_total + 1);
        stateMachine(states.QUIZ_STARTED_NO_ANSWER);
    }
}

// $('#btn-show-answer') is equivalent to pressing enter in the input boxes
// nextWord() will be useful in future version of the game in which input boxes will be visible
// together with the right or wrong message

$('#answer-past-simple').keydown(search);
$('#answer-past-participle').keydown(search);

function search(pressedKey){
    if(pressedKey.key === 'Enter'){
        if(
            $('#btn-show-answer').prop("disabled") == false &&
            $('#answer-past-simple').val().length > 0 &&
            $('#answer-past-participle').val().length > 0
        ){
            showAnswer();
        }
    }
}

$('#btn-end').click(function(){
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

$('#btn-reset').click(function(){
    stateMachine(states.STUDENT_REGISTERED);
    $('#word-no').text(0);
    $('#answer-infinitive').text("");
    $('#answer-past-simple').val("");
    $('#answer-past-participle').val("");
    resetStudentScore();
    updateStudentScore();
    adjustScoreBar("0.00");
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
    for(let i = 0; i < $('.answers').length; i++){
        $('.answers')[i].style.visibility = visibilityMode;
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
            $("#quiz-board-text").addClass("highlight");
            $("#quiz-log-table").slideUp(500);
            $("#quiz-log-table").find("tbody").empty();

            setLabelVisibility('collapse'); // Hide verbs. Message Board is showing a message
            showMessage('Choose how many words from the list you already know in the "learned words" box and start the quiz anytime.');
            $('#learned-words').prop("disabled", false);
            $('#btn-start').prop("disabled", false);
            $('#btn-start').css("background-color","#DDDD00");
            $('#btn-show-answer').prop("disabled", true);
            $('#btn-show-answer').css("background-color","#555500");
            $('#btn-reset').prop("disabled", true);
            $('#btn-reset').css("background-color","#555500");
            $('#btn-end').prop("disabled", true);
            $('#btn-end').css("background-color","#555500");
            $('#include-past-simple').prop("checked", true);
            $('#include-past-participle').prop("checked", true);
            $('#include-past-simple').prop("disabled", false);
            $('#include-past-participle').prop("disabled", false);
            break;
        case states.QUIZ_STARTED_NO_ANSWER:
            $("#answer-past-simple").removeClass("wrongAnswerHighlight");
            $("#answer-past-participle").removeClass("wrongAnswerHighlight");
            $("#quiz-board-text").removeClass("highlight");
            setLabelVisibility('visible'); // Show verbs. Student needs to write the answers
            showMessage('');
            shuffledIndex = shuffleVerb(listOfVerbs, $('#word-no'));
            console.log(shuffledIndex);
            showInfinitive($('#answer-infinitive'), $('#answer-past-simple'), $('#answer-past-participle'), listOfVerbs, shuffledIndex);
            $('#learned-words').prop("disabled", true);
            $('#btn-start').prop("disabled", true);
            $('#btn-start').css("background-color", "#555500");
            $('#btn-show-answer').prop("disabled", false);
            $('#btn-show-answer').css("background-color", "#DDDD00");
            $('#btn-reset').prop("disabled", false);
            $('#btn-reset').css("background-color", "#DDDD00");
            $('#btn-end').prop("disabled", false);
            $('#btn-end').css("background-color", "#DDDD00");
            $('#include-past-simple').prop("disabled", true);
            $('#include-past-participle').prop("disabled", true);
            if($('#include-past-simple').prop("checked") == false){
                $('#answer-past-simple').val("---");
                $('#answer-past-simple').prop("disabled", true);
            }else{
                $('#answer-past-simple').prop("disabled", false);
            }
            if($('#include-past-participle').prop("checked") == false){
                $('#answer-past-participle').val("---");
                $('#answer-past-participle').prop("disabled", true);
            }else{
                $('#answer-past-participle').prop("disabled", false);
            }
            $('#answer-past-simple').focus();
            break;
        case states.QUIZ_STARTED_ANSWER_CORRECT:
            // setLabelVisibility('collapse'); // Hide verbs. Message Board is showing a message
            showMessage('Congratulations! Your answer is correct.');
            showPast($('#answer-infinitive'), $('#answer-past-simple'), $('#answer-past-participle'), listOfVerbs, shuffledIndex);
            $('#answer-past-simple').prop("disabled", true);
            $('#answer-past-participle').prop("disabled", true);
            $('#learned-words').prop("disabled", true);
            $('#btn-start').prop("disabled", true);
            $('#btn-start').css("background-color", "#555500");
            $('#btn-show-answer').prop("disabled", true);
            $('#btn-show-answer').css("background-color", "#555500");
            $('#btn-reset').prop("disabled", false);
            $('#btn-reset').css("background-color", "#DDDD00");
            $('#btn-end').prop("disabled", false);
            $('#btn-end').css("background-color", "#DDDD00");
            adjustScoreBar($("#correct-pct").text());
            waitForNextWord(3);
            break;
        case states.QUIZ_STARTED_ANSWER_INCORRECT:
            //setLabelVisibility('collapse'); // Hide verbs. Message Board is showing a message
            showMessage('Unfortunately, your answer is incorrect.');
            showPast($('#answer-infinitive'), $('#answer-past-simple'), $('#answer-past-participle'), listOfVerbs, shuffledIndex);
            $('#answer-past-simple').prop("disabled", true);
            $('#answer-past-participle').prop("disabled", true);
            $('#learned-words').prop("disabled", true);
            $('#btn-start').prop("disabled", true);
            $('#btn-start').css("background-color", "#555500");
            $('#btn-show-answer').prop("disabled", true);
            $('#btn-show-answer').css("background-color", "#555500");
            $('#btn-reset').prop("disabled", false);
            $('#btn-reset').css("background-color", "#DDDD00");
            $('#btn-end').prop("disabled", false);
            $('#btn-end').css("background-color", "#DDDD00");
            adjustScoreBar($("#correct-pct").text());
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
            $('#learned-words').prop("disabled", true);
            $('#btn-start').prop("disabled", true);
            $('#btn-start').css("background-color", "#555500");
            $('#btn-show-answer').prop("disabled", true);
            $('#btn-show-answer').css("background-color", "#555500");
            $('#btn-reset').prop("disabled", false);
            $('#btn-reset').css("background-color", "#DDDD00");
            $('#btn-end').prop("disabled", true);
            $('#btn-end').css("background-color", "#555500");
            break;
    }  
}

function showMessage(message){
    $('#message').empty();
    message = message.split('\n');
    message.forEach(function(sentence){
        let messageText = $("<div>").text(sentence);
        messageText.addClass("messageBoardText");
        $('#message').append(messageText);
    });
}

function waitForNextWord(time){
    $('#btn-reset').prop("disabled", true);
    $('#btn-reset').css("background-color", "#555500");
    $('#btn-end').prop("disabled", true);
    $('#btn-end').css("background-color", "#555500");
    let seconds = $("<div>").text(time + "...");
    seconds.addClass("timer");
    $('#message').append(seconds);
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

function adjustScoreBar(newScore) {
    $(".score-percent").animate({width: newScore + "%"}, 3000);
}