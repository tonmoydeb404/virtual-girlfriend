// SELECT DOCUMENT
const contentText = document.querySelector('.content-text');
const contentImg = document.querySelector('.content-img');
const settings = document.querySelector('.settings');
const settingsBtn = document.querySelector('.settings-btn');
const yourNameInput = document.querySelector('.your-name-input');
const herNameInput = document.querySelector('.her-name-input');

const dataTab = document.querySelector('.data-tab');
const customTab = document.querySelector('.custom-tab');

const questionInput = document.querySelector('.custom-question-input');
const ansInput = document.querySelector('.custom-ans-input');
const addBtn = document.querySelector('.add-btn');

const talkBackSwitch = document.querySelector('.talkBackSwitch');

// DATA
let yourName = (localStorage.getItem('yourName') != null)? localStorage.getItem('yourName') : 'Tom';
yourNameInput.value = yourName;
let herName = (localStorage.getItem('herName') != null)? localStorage.getItem('herName') : 'Jerry';
herNameInput.value = herName;

let data = [];

let savedData = (localStorage.getItem('userData') != null)? true : false;
let userData = (savedData)? JSON.parse(localStorage.getItem("userData")) : [];

let talkBack = false;
let recognizing = false;

let interVal = '';

// VOICE RECOGNITION
const speechRecognition = window.speechRecognition || window.webkitSpeechRecognition;
const recognition = new speechRecognition();

recognition.onstart = () => {
    recognition.continuous = true;
    recognizing = true;
}

recognition.onspeechstart = () => {
    contentText.innerHTML = 'I am Listening';
} 

recognition.onend = () => {
    recognizing = false;
    recognition.start()
    contentText.innerHTML= 'Say Something More';
} 

recognition.onresult = (event) => {
    let resultIndex = event.resultIndex;
    let transcript = event.results[resultIndex][0].transcript;

    transcript = transcript.replace(`${yourName}`, '');
    transcript = transcript.replace(`${herName}`, '');
    transcript = transcript.trim();

    if (talkBack){
        readData(transcript)
    }else{
        readData(findData(transcript))
    }
}

// FUNCTIONS

// ASSIGNING THE DEFAULT DATA
function assignData(yourName, herName) {
    data = [
        {
            title       :   'Introduction',
            questions   :   ['hi', 'hello', 'hey', 'whatsup'],
            ans         :   ['Hi', 'Hi Babe', 'Hi Sweetheart', 'Hi Babu', `Hi ${yourName}`, 'Hello' , 'Hello Babe', 'Hello Sweetheart', 'Hello Babu', 'Hey', 'Hey Babe', 'Hey Sweetheart', 'Hey Babu', 'Whatsup', 'Whatsup Babe', 'Whatsup Sweetheart', 'Whatsup Babu'],
        },
        {
            title       :   'Propose',
            questions   :   ['I Love You', 'Love You'],
            ans         :   ['I Love You Two', 'Love You', 'Amio Tumake ValoBashi', 'Love You Sweetheart'],
        },
        {
            title       :   'Her Name',
            questions   :   ['what is your name', 'your name', 'who are you'],
            ans         :   [herName, `I am ${herName}`, `My Name Is ${herName}`]
        },
        {
            title       :   'Your Name',
            questions   :   ['what is my name', 'my name', 'Do You Know Me', 'Who I am'],
            ans         :   [yourName, `You Are ${yourName}`, `Your Name Is ${yourName}`]
        },
        {
            title       :   'About Developer',
            questions   :   ['Who Is Your Owner', 'Your Owner', 'Who Makes You', 'Who Is Your Developer'],
            ans         :   ['DevTom', 'Tom', 'Tonmoy']
        }
    ]
}

// TRANSITION FOR SETTING TAB
function showHide() {
    settings.classList.add('animation');
    settings.classList.toggle('hide');
    settingsBtn.classList.toggle('bg-danger');
    settingsBtn.classList.toggle('text-light');
}

// FUNCTION FOR MAKING TABLES
function loadDataTable(data, target, IsSavedData) {
    var title, tableData, tableIndex, html;
    tableIndex = 0;
    html ='';

    data.forEach(item => {
        title = (item.title == undefined)? `<thead><tr><th scope="col">#</th><th scope="col">Noname</th></tr></thead>` : `<thead><tr><th scope="col">#</th><th scope="col">${item.title}</th></tr></thead>`;
        tableData= '';
        // VALIDATING THAT IF USER HAVE ANY SAVED DATA IN HIS LOCALSTORAGE THEN IT WILL EXECUTE
        if(IsSavedData){
            // ASSIGNING QUESTION AND ANSWER IN A ROW
            tableData = `<tr data-index="${++tableIndex}" class="table-row" ><th class='deleteTableData'><i class="bi bi-trash"></i></th><td data-target="question" >${item.question}</td><td data-target="ans" >${item.ans}</td></tr>`;
            // ASSIGNING ALL ROW IN A SINGLE VARRIABLE
            html += tableData;

        }else{
            // MAKING TABLE WITH DEFAULT DATA
            item.questions.forEach((question, index) => {
                // ASSIGNING QUESTION IN A ROW
                tableData += `<tr><th scope="row">${++index}</th><td>${question}</td></tr>`;
            });
            // MAKING TABLE STRUCTURE AND STORING ALL QUESTION ROW
            html += `${title}<tbody>${tableData}</tbody>`;
        }
        
    });
    // ADDING TABLE TO THE TARGETED ELEMENT
    target.innerHTML = html;
}

// FUNCTION FOR ADDING NEW DATA TO THE CUSTOM TABLE
function addNewData() {
    // MAKING A OBJECT TO STORE USER DATA
    let userAddedData = {};

    if(questionInput.value.length > 0 && ansInput.value.length > 0){
        // STORING DATA TO THE OBJECT
        userAddedData.question =questionInput.value;
        userAddedData.ans =ansInput.value;
        // ASSIGNING THE NEW USER DATA OBJECT
        userData.push(userAddedData);
        // CLEARING THE INPUTS
        questionInput.value = '';
        ansInput.value = '';

        // STORING DATA TO THE LOCALSTORAGE
        localStorage.setItem('userData', JSON.stringify(userData));
        savedData = true;
        // LOADING TABLE WITH NEW ASSIGNED DATA
        loadDataTable(userData, customTab, savedData);
    }else{
        alert('Please Input A Valid Data');
    }
}

// FINDING DATA FOR ANSWERING THE QUESTIONS
function findData(transcript) {
    let text, notMatched;
    notMatched = true;
    
    // CHECKING DATA FROM USERSAVED DATA
    if(savedData){
        userData.forEach(dataItem => {
            if(dataItem.question.toLowerCase() == transcript){
                text = dataItem.ans;
                notMatched = false;
                return;
            }
        })
    }
    // CHECKING DATA FROM DEFAULT DATA
    if (notMatched) {
        let dataObj = data.find(dataItem => {
            let x = dataItem.questions.some(question => {
                return question.toLowerCase() == transcript.toLowerCase();
            })

            return x;
        })

        // CHOOSING A RANDOM ANSWER
        text = (dataObj != undefined)? dataObj.ans[Math.floor(Math.random() * dataObj.ans.length)] : false;
    }

    return text;
}

// READ THE THE GIVEN ANSWER
function readData(message) {

    // VALIDATING THAT THE ANSWER IS AVAILABLE
    message = (message == false)? "Uff Bujlam Na" : message;

    const speech = new SpeechSynthesisUtterance();
    speech.text = message;
    speech.volume = 1;
    speech.rate = 1;
    speech.pitch = 1;

    window.speechSynthesis.speak(speech);
    // ADDING A ANIMATION IN IMAGE WHILE SHE IS SPEAKING
    interVal = setInterval(() => {
        readAnim(window.speechSynthesis.speaking)
    }, 100);
}

// ANIMATION FOR THE IMAGE BUTTON
function readAnim(speaking) {
    if(speaking){
        if(!(contentImg.classList.contains('readAnim'))){
            contentImg.classList.add('readAnim');
        }else{
            return;
        }
    }else{
        contentImg.classList.remove('readAnim');
        clearInterval(interVal);
        recognition.abort()
    }
}

// DELETING A DATA FROM USER SAVED DATA
function deleteData(event) {
    // VALIDATING THE RIGHT BUTTON
    if(event.target.classList.contains('deleteTableData')){
        // SELECTING THE PARENT ELEMENT
        const tableParent = event.target.parentElement;
        // STORING THE PARENT ELEMENT DATA INDEX VALUE TO SELECT THE CHILD ELEMENT
        const tableParentIndex = tableParent.dataset.index;

        if(tableParent.classList.contains('table-row')){
            // SELECTING THE CHILD ELEMENTS
            const tableQuestion = document.querySelector(`tr[data-index="${tableParentIndex}"] td[data-target="question"]`);
            const tableAns = document.querySelector(`tr[data-index="${tableParentIndex}"] td[data-target="ans"]`);

            // SELECTING THE CORRECT OBJECT FROM USER DATA BY MATCHING THE DATA WITH SELECTED TABLE ELEMENT 
            let targetedTable = userData.find(tableRow => {
                return (tableRow.question.toLowerCase() == tableQuestion.innerText.toLowerCase() && tableRow.ans.toLowerCase() == tableAns.innerText.toLowerCase());
            })

            // BASIC VALIDATION IF THE DATA OBJECT NOT MATCHED
            if(targetedTable != undefined){
                // FILTERING USERDATA AND REMOVING THE TARGETED OBJECT
                userData = userData.filter(value => {
                    return value != targetedTable;
                });
                // SAVING NEW USER DATA TO THE LOCAL STORAGE
                localStorage.setItem('userData', JSON.stringify(userData));
                // LOADING THE CUSTOM TABLE WITH NEW FILTERD USER DATA
                loadDataTable(userData, customTab, savedData);

            }
        }                                                                                       
}else{
        return;
    }
    
}

// HANDLING INPUT DATA
function handleInput(event) {
    let target = event.target;

    if(target.dataset.target == "yourName"){
        yourName = target.value;       
        localStorage.setItem('yourName', yourName);

    }else if(target.dataset.target == "herName"){
        herName = target.value;
        localStorage.setItem('herName', herName);
    }

    assignData(yourName, herName)
}

// HANDLING TALKBACK SWITCH
function handleSwitch() {
    talkBack = talkBackSwitch.checked;
}


// EVENT LISTENER

settingsBtn.addEventListener('click', showHide);
addBtn.addEventListener('click', addNewData);
contentImg.addEventListener('click', () => {
    if(recognizing){
        recognition.abort()
    }else{
        recognition.start()
        contentText.innerHTML= 'Say Something';
    }
})
yourNameInput.addEventListener('input', handleInput);
herNameInput.addEventListener('input', handleInput);
customTab.addEventListener('click', deleteData);
talkBackSwitch.addEventListener('click', handleSwitch);

// CALL FUNCTION

assignData(yourName, herName)
loadDataTable(data,dataTab);
if(savedData)loadDataTable(userData,customTab, savedData);

