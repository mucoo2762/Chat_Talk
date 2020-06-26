'use strict';

// const dateSpan = document.querySelector(".dateSpan");
const OpponentNmSpan = document.querySelector("#navOpponentName");
const section = document.querySelector("section");
let sectionDiv = null;

let opponentName = "";
let chatDate = "";
const opponentImg = "profileImg";
let USER_NAME_SS = "";
let USER_IMG_SS = "";
let OPPONENT_IMG_SS = "";
let OPPONENT_NAME_SS = "";

const PATH_CHAT = "http://localhost:3030/";
const chatListArr = [];
const weekArr = new Array('일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일');


class chatCls{
    constructor(key, user, content, time, opponent){
        this.key = key;
        this.user = user;
        this.content = content;
        this.time = time;
        this.opponent = opponent;
    }
}

// ================================================================

function sendAjax(url){
    var data = {
        user: sessionStorage.getItem("user_name"),
        opponent: sessionStorage.getItem("chatOpponent")
    };
    data = JSON.stringify(data);
    var xhr = new XMLHttpRequest();
    xhr.open('POST', url);
    xhr.setRequestHeader('Content-Type', "application/json");
    xhr.send(data);
    xhr.addEventListener('load', () => {
        const result = JSON.parse(xhr.responseText);
        const chatObjArr = JSON.parse(result);

        chatObjArr.forEach((chatobj) => {
            paintChat(chatobj);
        });
    });
}

// ============================================================

function paintOpponentName(){
    OpponentNmSpan.innerHTML = opponentName;

    sectionDiv.scrollTop = sectionDiv.scrollHeight;
}

function paintChat(chat){
    const user = chat.user;
    const content = chat.content;
    const chatOpponent = chat.opponent;
    const time = chat.time;
    const chatDay = new Date(`20${time.substr(0, 2)}-${time.substr(2, 2)}-${time.substr(4, 2)}`).getDay();
    const week = weekArr[chatDay];
    const date = `20${time.substr(0, 2)}년 ${time.substr(2, 2)}월 ${time.substr(4, 2)}일 ${week}`;

    if(date !== chatDate){ 
        chatDate = date; 

        const newDateDiv = document.createElement("div");
        const newDateSpan = document.createElement("span");

        newDateDiv.classList.add("dateDiv");
        newDateSpan.classList.add("dateSpan");
        newDateSpan.innerHTML = date;

        newDateDiv.appendChild(newDateSpan);
        sectionDiv.appendChild(newDateDiv);
    }

    const amOrPm = time.substr(6, 2) < 12 ? '오전' : '오후';

    const div = document.createElement("div");
    const imgSpan = document.createElement("span");
    const textSpan = document.createElement("span");
    textSpan.classList.add("textspan");
    const timeSpan = document.createElement("span");
    timeSpan.classList.add("timespan");
    const nameSpan = document.createElement("span");

    // ===================================
    textSpan.innerText = content;
    timeSpan.innerText = `${amOrPm} ${time.substr(6, 2) > 12 ? parseInt(time.substr(6, 2))-12 : time.substr(6, 2)}:${time.substr(8, 2)}`;
    // ===================================

    if(user === USER_NAME_SS){
        if(chatOpponent !== opponentName){ opponentName = chatOpponent; }

        div.classList.add("rightChatDiv");
        // ===================================
        div.appendChild(timeSpan);
        div.appendChild(textSpan);
    }else{
        div.classList.add("leftChatDiv");
        // ===================================
        const image = new Image();
        image.src = `images/${sessionStorage.getItem("chatOpponentImg")}`;
        image.classList.add("progileImg");
        imgSpan.appendChild(image);

        div.appendChild(imgSpan);
        // ===================================
        if(user !== opponentName){ opponentName = user; }

        nameSpan.innerText = `${user}`;
        nameSpan.classList.add("progileName");

        const spanDiv = document.createElement("div");
        spanDiv.classList.add("oppntSpanDiv");
        spanDiv.appendChild(nameSpan);
        spanDiv.appendChild(textSpan);
        // ===================================
        div.appendChild(spanDiv);
        div.appendChild(timeSpan);
    }

    sectionDiv.appendChild(div);
    
    paintOpponentName();
}

function getChatObj(){
    sendAjax(`${PATH_CHAT}ajax_get_chat_cont`);
}

function createSectionDiv(){
    const div = document.createElement("div");
    div.classList.add("sectionDiv");

    section.appendChild(div);

    sectionDiv = document.querySelector(".sectionDiv");
}

// =============================================================

function init(){
    USER_NAME_SS = sessionStorage.getItem("user_name");
    OPPONENT_NAME_SS = sessionStorage.getItem("chatOpponent");
    OPPONENT_IMG_SS = sessionStorage.getItem("chatOpponentImg");

    opponentName = "";
    chatDate = "";

    createSectionDiv();
    getChatObj();
    // setInterval(() => {
    //     getChatObj();
    // }, 3000);
    
}
init();