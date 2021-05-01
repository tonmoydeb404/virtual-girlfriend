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
    contentText.innerHTML= 'Say Something';
}

recognition.onspeechstart = () => {
    contentText.innerHTML = 'I am Listening';
} 

recognition.onend = () => {
    recognizing = false;
} 

recognition.onresult = (event) => {
    let resultIndex = event.resultIndex;
    let transcript = event.results[resultIndex][0].transcript;

    // transcript = transcript.replace(`${yourName}`, '');
    transcript = transcript.replace(`${herName}`, '');
    transcript = transcript.trim();

    if (talkBack){
        readData(transcript)
    }else{
        readData(findData(transcript))
    }
}

// FUNCTIONS

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

function showHide() {
    settings.classList.add('animation');
    settings.classList.toggle('hide');
    settingsBtn.classList.toggle('bg-danger');
    settingsBtn.classList.toggle('text-light');
}

function loadDataTable(data, target, IsSavedData) {
    var title, tableData, tableIndex, html;
    tableIndex = 0;
    html ='';

    data.forEach(item => {

        title = (item.title == undefined)? `<thead><tr><th scope="col">#</th><th scope="col">Noname</th></tr></thead>` : `<thead><tr><th scope="col">#</th><th scope="col">${item.title}</th></tr></thead>`;
        tableData= '';

        if(IsSavedData){
            tableData += `<tr data-index="${++tableIndex}" class="table-row" ><th class='deleteTableData'><i class="bi bi-trash"></i></th><td data-target="question" >${item.question}</td><td data-target="ans" >${item.ans}</td></tr>`;

            html += tableData;

        }else{
            
            item.questions.forEach((question, index) => {
                tableData += `<tr><th scope="row">${++index}</th><td>${question}</td></tr>`;
            });

            html += `${title}<tbody>${tableData}</tbody>`;
        }
        
    });
    target.innerHTML = html;
}

function addNewData() {
    let userAddedData = {};
    if(questionInput.value.length > 0 && ansInput.value.length > 0){
        userAddedData.question =questionInput.value;
        userAddedData.ans =ansInput.value;

        userData.push(userAddedData);

        questionInput.value = '';
        ansInput.value = '';

        localStorage.setItem('userData', JSON.stringify(userData));
        savedData = true;
        loadDataTable(userData, customTab, savedData);
    }else{
        alert('Please Input A Valid Data');
    }
}

function findData(transcript) {
    let text, notMatched;
    notMatched = true;

    if(savedData){
        userData.forEach(dataItem => {
            if(dataItem.question.toLowerCase() == transcript){
                text = dataItem.ans;
                notMatched = false;
                return;
            }
        })
    }

    if (notMatched) {
        let dataObj = data.find(dataItem => {
            let x = dataItem.questions.some(question => {
                return question.toLowerCase() == transcript.toLowerCase();
            })

            return x;
        })

        text = (dataObj != undefined)? dataObj.ans[Math.floor(Math.random() * dataObj.ans.length)] : false;
    }

    return text;
}

function readData(message) {

    message = (message == false)? "Uff Bujlam Na" : message;

    const speech = new SpeechSynthesisUtterance();
    speech.text = message;
    speech.volume = 1;
    speech.rate = 1;
    speech.pitch = 1;

    contentText.innerHTML=message;
    window.speechSynthesis.speak(speech);
    interVal = setInterval(() => {
        readAnim(window.speechSynthesis.speaking)
    }, 100);
}

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

function deleteData(event) {
    if(event.target.classList.contains('deleteTableData')){
        const tableParent = event.target.parentElement;
        const tableParentIndex = tableParent.dataset.index;

        if(tableParent.classList.contains('table-row')){
            const tableQuestion = document.querySelector(`tr[data-index="${tableParentIndex}"] td[data-target="question"]`);
            const tableAns = document.querySelector(`tr[data-index="${tableParentIndex}"] td[data-target="ans"]`);

            let targetedTable = userData.find(tableRow => {
                return (tableRow.question.toLowerCase() == tableQuestion.innerText.toLowerCase() && tableRow.ans.toLowerCase() == tableAns.innerText.toLowerCase());
            })

            if(targetedTable != undefined){
                userData = userData.filter(value => {
                    return value != targetedTable;
                });
                localStorage.setItem('userData', JSON.stringify(userData));

                loadDataTable(userData, customTab, savedData);

            }
        }                                                                                       
}else{
        return;
    }
    
}

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

function handleSwitch() {
    talkBack = talkBackSwitch.checked;
}


// EVENT LISTENER

settingsBtn.addEventListener('click', showHide);
addBtn.addEventListener('click', addNewData);
contentImg.addEventListener('click', () => {
    if(recognizing){
        recognition.abort()
        recognition.start()
    }else{
        recognition.start()
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

