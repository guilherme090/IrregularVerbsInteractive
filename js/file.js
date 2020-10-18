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

let studentLearnedWords = document.querySelector('#learned-words');

// Message board

let messageBoard = document.querySelector('#message');

// Quiz area

let wordNumber = document.querySelector('#word-no');
let correctPct = document.querySelector('#correct-pct');
let infinitiveAnswer = document.querySelector('#answer-infinitive');
let pastSimpleAnswer = document.querySelector('#answer-past-simple');
let pastParticipleAnswer = document.querySelector('#answer-past-participle');

// Quiz log board

let quizLogBoard = document.querySelector('#message-log');

// Update functions
function updateStudentScore(){
    if(aluno.words_total === 0){
        correctPct.innerHTML = '0.00';
    }
    else{
        correctPct.innerHTML = (aluno.words_right / aluno.words_total * 100).toFixed(2); 
    } 
}

let rawListOfVerbs = 
"say#said#said*" +
"make#made#made*" +
"go#went#gone*" +
"take#took#taken*" +
"come#came#come*" +
"see#saw#seen*" +
"know#knew#known*" +
"get#got#got/gotten*" +
"give#gave#given*" +
"find#found#found*" +
"think#thought#thought*" +
"tell#told#told*" +
"become#became#become*" +
"show#showed#shown*" +
"leave#left#left*" +
"feel#felt#felt*" +
"put#put#put*" +
"bring#brought#brought*" +
"begin#began#begun*" +
"keep#kept#kept*" +
"hold#held#held*" +
"write#wrote#written*" +
"stand#stood#stood*" +
"hear#heard#heard*" +
"let#let#let*" +
"mean#meant#meant*" +
"set#set#set*" +
"meet#met#met*" +
"run#ran#run*" +
"pay#paid#paid*" +
"sit#sat#sat*" +
"speak#spoke#spoken*" +
"lie#lay#lain*" +
"lead#led#led*" +
"read#read#read*" +
"grow#grew#grown*" +
"lose#lost#lost*" +
"fall#fell#fallen*" +
"send#sent#sent*" +
"build#built#built*" +
"understand#understood#understood*" +
"draw#drew#drawn*" +
"break#broke#broken*" +
"spend#spent#spent*" +
"cut#cut#cut*" +
"rise#rose#risen*" +
"drive#drove#driven*" +
"buy#bought#bought*" +
"wear#wore#worn*" +
"choose#chose#chosen*" +
"seek#sought#sought*" +
"throw#threw#thrown*" +
"catch#caught#caught*" +
"deal#dealt#dealt*" +
"win#won#won*" +
"forget#forgot#forgotten*" +
"lay#laid#laid*" +
"sell#sold#sold*" +
"fight#fought#fought*" +
"bear#bore#born*" +
"teach#taught#taught*" +
"eat#ate#eaten*" +
"sing#sang#sung*" +
"strike#struck#struck*" +
"hang#hung#hung*" +
"shake#shook#shaken*" +
"ride#rode#ridden*" +
"feed#fed#fed*" +
"shoot#shot#shot*" +
"drink#drank#drunk*" +
"hit#hit#hit*" +
"arise#arose#arisen*" +
"fly#flew#flown*" +
"spread#spread#spread*" +
"sleep#slept#slept*" +
"cost#cost#cost*" +
"beat#beat#beaten*" +
"light#lit#lit*" +
"bind#bound#bound*" +
"cast#cast#cast*" +
"hide#hid#hidden*" +
"swing#swung#swung*" +
"blow#blew#blown*" +
"swim#swam#swum*" +
"bend#bent#bent*" +
"wake#woke#woken*" +
"stick#stuck#stuck*" +
"sweep#swept#swept*" +
"undertake#undertook#undertaken*" +
"shut#shut#shut*" +
"steal#stole#stolen*" +
"tear#tore#torn*" +
"hurt#hurt#hurt*" +
"ring#rang#rung*" +
"lend#lent#lent*" +
"sink#sank#sunk*" +
"overcome#overcame#overcome*" +
"freeze#froze#frozen*" +
"shine#shone#shone*" +
"withdraw#withdrew#withdrawn";

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
    let takenVerbs = Number(currentWordCount.innerHTML) - 1;
    console.log('Word count = ' + takenVerbs);
    let shuffledNumber = Math.floor(Math.random() * (Number(studentLearnedWords.value) - takenVerbs)); 
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
    theInfinitive.innerHTML = theListOfVerbs[theIndex].infinitive;
    thePastSimple.value = '';
    thePastParticiple.value = '';
}

function showPast(theInfinitive, thePastSimple, thePastParticiple, theListOfVerbs, theIndex){
    messageBoard.innerHTML = messageBoard.innerHTML + '<br />' + '<br />' +
    '(' + theListOfVerbs[theIndex].infinitive + ' - ' + theListOfVerbs[theIndex].pastSimple + ' - ' + theListOfVerbs[theIndex].pastParticiple + ')';
}

/*
----------------------------------------------------------------------------------
List of verbs
----------------------------------------------------------------------------------
Instead of reading an external .txt file, the list of verbs was hard coded above, but it will be
converted to a data structure inside the program in the same way as before.
*/

let verbsReadWithLineBreak = rawListOfVerbs.replace(/(\r\n|\n|\r)/gm,""); 

let verbsRead = verbsReadWithLineBreak.split('*');

console.log(verbsRead);

const listOfVerbs = []; // stores all verbs that are in the txt file loaded as verb list.

verbsRead.forEach(verbForm => {
    let singleVerb = verbForm.split('#');
    listOfVerbs.push(new verb(singleVerb[0], singleVerb[1], singleVerb[2], false));   
});

console.log(listOfVerbs);

let startBtn = document.querySelector('#btn-start');
startBtn.onclick = function(){
    // Only start the quiz if there is a list of verbs loaded to the system.
    if(listOfVerbs.length > 0){
        wordNumber.innerHTML = 1;
        resetVerbList(listOfVerbs);
        // Initialize score
        resetStudentScore();
        updateStudentScore();
        logMessage = 'QUIZ LOG:<br><br>';
        if(studentLearnedWords.value < 1){
            // invalid number of learned words
            studentLearnedWords.value = 1;
        }else if(studentLearnedWords.value > listOfVerbs.length){
            // invalid number of learned words
            studentLearnedWords.value = listOfVerbs.length;
        }

        stateMachine(states.QUIZ_STARTED_NO_ANSWER);
    }
    else{
        alert('Cannot start quiz because there are no verbs to be shown. Load a valid list of verbs to the application.');
    }
    
}

function correctWord(){
    aluno.words_right ++;
    aluno.words_total ++;
    console.log(aluno);
    updateStudentScore();
    logMessage = logMessage.concat('| ' + infinitiveAnswer.innerHTML + ' | ' + 
        pastSimpleAnswer.value + ' | ' + pastParticipleAnswer.value + ' |' + ' >>> (correct)' + '<br>');
    quizLogBoard.innerHTML = logMessage;
};

function incorrectWord(){
    aluno.words_total ++;
    console.log(aluno);
    updateStudentScore();
    logMessage = logMessage.concat('*| ' + infinitiveAnswer.innerHTML + ' | ' + 
    pastSimpleAnswer.value + ' | ' + pastParticipleAnswer.value + ' |' + ' >>> (incorrect)' + '<br>');
    quizLogBoard.innerHTML = logMessage;
};

let showAnsBtn = document.querySelector('#btn-show-answer');
showAnsBtn.onclick = function(){
    // Signal to the state machine that answer was shown
    if(pastSimpleAnswer.value.toLowerCase() === listOfVerbs[shuffledIndex].pastSimple &&
       pastParticipleAnswer.value.toLowerCase() === listOfVerbs[shuffledIndex].pastParticiple ){
        correctWord();
        stateMachine(states.QUIZ_STARTED_ANSWER_CORRECT);
    }else{
        incorrectWord();
        stateMachine(states.QUIZ_STARTED_ANSWER_INCORRECT);
    }
};

let nextWordBtn = document.querySelector('#btn-next-word');
nextWordBtn.onclick = function(){
    // Check if all words were already taken. No new words to show.
    if(aluno.words_total >= Number(studentLearnedWords.value))
    {
        stateMachine(states.NO_MORE_WORDS);
    } else{
        wordNumber.innerHTML = aluno.words_total + 1;
        stateMachine(states.QUIZ_STARTED_NO_ANSWER);
    }
}

/* 
----------------------------------------------------------------------------------
Program resetting
----------------------------------------------------------------------------------
The program erases all data and becomes prepared to a new quiz.
*/ 

const saveBtn = document.querySelector('#btn-save');
saveBtn.onclick = function(){
    // Mount text file using * separators;
     
    //let data = studentName.innerHTML + '*' + studentLearnedWords.innerHTML;
    logMessage = logMessage.concat('\n' + 'Words correct: ' + aluno.words_right + '\n' + 
        'Words incorrect: ' + String(aluno.words_total - aluno.words_right) + '\n' +
        'Total number of words: ' + aluno.words_total + '\n' +
        'Score: ' + String((aluno.words_right * 100 / aluno.words_total).toFixed(2)) + '%\n' );

    stateMachine(states.STUDENT_REGISTERED);
    wordNumber.innerHTML = 0;
    infinitiveAnswer.innerHTML = '';
    pastSimpleAnswer.value = '';
    pastParticipleAnswer.value = '';
    resetStudentScore();
    updateStudentScore();
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
    QUIZ_STARTED_ANSWER_SHOWN: 'quiz-started-answer-shown',
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
            messageBoard.innerHTML = 'Choose how many words from the list you already know in the "learned words" box and start the quiz anytime.';
            // newStudentBtn.disabled = false;
            // newStudentBtn.style.backgroundColor="#DDDD00";
            // loadBtn.disabled = false;
            // loadListBtn.disabled = false;
            studentLearnedWords.disabled = false;
            startBtn.disabled = false;
            startBtn.style.backgroundColor="#DDDD00";
            showAnsBtn.disabled = true;
            showAnsBtn.style.backgroundColor="#555500";
            nextWordBtn.disabled = true;
            nextWordBtn.style.backgroundColor="#555500";
            // correctBtn.disabled = true;
            // correctBtn.style.backgroundColor="#005500";
            // incorrectBtn.disabled = true;
            // incorrectBtn.style.backgroundColor="#550000";
            saveBtn.disabled = true;
            saveBtn.style.backgroundColor="#555500";
            break;
        case states.QUIZ_STARTED_NO_ANSWER:
            messageBoard.innerHTML = 'What are the past simple and past participle forms of the shuffled verb?';
            shuffledIndex = shuffleVerb(listOfVerbs, wordNumber);
            console.log(shuffledIndex);
            showInfinitive(infinitiveAnswer, pastSimpleAnswer, pastParticipleAnswer, listOfVerbs, shuffledIndex);
            // newStudentBtn.disabled = true;
            // newStudentBtn.style.backgroundColor="#555500";
            // loadBtn.disabled = true;
            // loadListBtn.disabled = true;
            studentLearnedWords.disabled = true;
            startBtn.disabled = true;
            startBtn.style.backgroundColor="#555500";
            showAnsBtn.disabled = false;
            showAnsBtn.style.backgroundColor="#DDDD00";
            nextWordBtn.disabled = true;
            nextWordBtn.style.backgroundColor="#555500";
            // correctBtn.disabled = true;
            // correctBtn.style.backgroundColor="#005500";
            // incorrectBtn.disabled = true;
            // incorrectBtn.style.backgroundColor="#550000";
            saveBtn.disabled = false;
            saveBtn.style.backgroundColor="#DDDD00";
            break;
        case states.QUIZ_STARTED_ANSWER_SHOWN:
            messageBoard.innerHTML = 'Was the given answer correct or incorrect?';
            showPast(infinitiveAnswer, pastSimpleAnswer, pastParticipleAnswer, listOfVerbs, shuffledIndex);
            // newStudentBtn.disabled = true;
            // newStudentBtn.style.backgroundColor="#555500";
            // loadBtn.disabled = true;
            // loadListBtn.disabled = true;
            studentLearnedWords.disabled = true;
            startBtn.disabled = true;
            startBtn.style.backgroundColor="#555500";
            showAnsBtn.disabled = true;
            showAnsBtn.style.backgroundColor="#555500";
            nextWordBtn.disabled = false;
            nextWordBtn.style.backgroundColor="#DDDD00";
            // correctBtn.disabled = false;
            // correctBtn.style.backgroundColor="#00DD00";
            // incorrectBtn.disabled = false;
            // incorrectBtn.style.backgroundColor="#DD0000";
            saveBtn.disabled = false;
            saveBtn.style.backgroundColor="#DDDD00";
            break;
        case states.QUIZ_STARTED_ANSWER_CORRECT:
            messageBoard.innerHTML = 'Congratulations! Your answer is correct.';
            showPast(infinitiveAnswer, pastSimpleAnswer, pastParticipleAnswer, listOfVerbs, shuffledIndex);
            // newStudentBtn.disabled = true;
            // newStudentBtn.style.backgroundColor="#555500";
            // loadBtn.disabled = true;
            // loadListBtn.disabled = true;
            studentLearnedWords.disabled = true;
            startBtn.disabled = true;
            startBtn.style.backgroundColor="#555500";
            showAnsBtn.disabled = true;
            showAnsBtn.style.backgroundColor="#555500";
            nextWordBtn.disabled = false;
            nextWordBtn.style.backgroundColor="#DDDD00";
            // correctBtn.disabled = false;
            // correctBtn.style.backgroundColor="#00DD00";
            // incorrectBtn.disabled = false;
            // incorrectBtn.style.backgroundColor="#DD0000";
            saveBtn.disabled = false;
            saveBtn.style.backgroundColor="#DDDD00";
            break;
        case states.QUIZ_STARTED_ANSWER_INCORRECT:
            messageBoard.innerHTML = 'Unfortunately, your answer is incorrect.';
            showPast(infinitiveAnswer, pastSimpleAnswer, pastParticipleAnswer, listOfVerbs, shuffledIndex);
            // newStudentBtn.disabled = true;
            // newStudentBtn.style.backgroundColor="#555500";
            // loadBtn.disabled = true;
            // loadListBtn.disabled = true;
            studentLearnedWords.disabled = true;
            startBtn.disabled = true;
            startBtn.style.backgroundColor="#555500";
            showAnsBtn.disabled = true;
            showAnsBtn.style.backgroundColor="#555500";
            nextWordBtn.disabled = false;
            nextWordBtn.style.backgroundColor="#DDDD00";
            // correctBtn.disabled = false;
            // correctBtn.style.backgroundColor="#00DD00";
            // incorrectBtn.disabled = false;
            // incorrectBtn.style.backgroundColor="#DD0000";
            saveBtn.disabled = false;
            saveBtn.style.backgroundColor="#DDDD00";
            break;
        case states.NO_MORE_WORDS:
            messageBoard.innerHTML = 'There are no more words to show. Press RESET QUIZ to create a new quiz.';
            // newStudentBtn.disabled = true;
            // newStudentBtn.style.backgroundColor="#555500";
            // loadBtn.disabled = true;
            // loadListBtn.disabled = true;
            studentLearnedWords.disabled = true;
            startBtn.disabled = true;
            startBtn.style.backgroundColor="#555500";
            showAnsBtn.disabled = true;
            showAnsBtn.style.backgroundColor="#555500";
            nextWordBtn.disabled = true;
            nextWordBtn.style.backgroundColor="#555500";
            // correctBtn.disabled = true;
            // correctBtn.style.backgroundColor="#005500";
            // incorrectBtn.disabled = true;
            // incorrectBtn.style.backgroundColor="#550000";
            saveBtn.disabled = false;
            saveBtn.style.backgroundColor="#DDDD00";
            break;
    }
}