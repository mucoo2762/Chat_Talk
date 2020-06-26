// 'use strict';

const headerNav = document.querySelector("header > .chatNav");
const nameSpaninNav = headerNav.querySelector("#navOpponentName");
const hiddenSpanForSearch = headerNav.querySelector("#hiddenSpanForSearch");
const searchBtninNav = headerNav.querySelector("#searchBtn");

const footerInputForm = document.querySelector(".footerInputForm");
const footerInput = footerInputForm.querySelector(".footerInput");
const headerInputForm = document.querySelector(".headerInputForm");
const headerInput = headerInputForm.querySelector(".headerInput");
const backBtn = document.querySelector("#backBtn");

const PATH_SERVICE = "http://localhost:3030/";

// ================================================================
function pageReload(){
    location.reload();
}

function sendAjaxForChat(url, obj){
        var data = {
            'key': obj.key,
            'text': obj.content,
            'user': obj.user,
            'opponent': obj.opponent,
            'time': obj.time
        };
        data = JSON.stringify(data);
        console.log(data);
        var xhr = new XMLHttpRequest();
        xhr.open('POST', url);
        xhr.setRequestHeader('Content-Type', "application/json");
        xhr.send(data);
        xhr.addEventListener('load', () => {
            const result = JSON.parse(xhr.responseText);
            console.log(result);

            if(result === "Insert success"){
                pageReload();
            }
        });
}

function sendAjaxForSearch(url, obj){
    let data = JSON.stringify(obj);
    var xhr = new XMLHttpRequest();
    xhr.open('POST', url);
    xhr.setRequestHeader('Content-Type', "application/json");
    xhr.send(data);
    xhr.addEventListener('load', () => {
        const result = JSON.parse(xhr.responseText);
        const chatObjArr = JSON.parse(result);

        resetChat();
        chatObjArr.forEach((chatobj) => {
            paintChat(chatobj);
        });
    });

}

// ================================================================

function resetChat(){
    section.removeChild(section.querySelector(".sectionDiv"));

    createSectionDiv();
}

function getDate(){
    const currentDate = new Date();
    const date_year = currentDate.getUTCFullYear();
    const date_month = currentDate.getMonth() + 1 < 10 ? `0${currentDate.getMonth() + 1}` : currentDate.getMonth() + 1;
    const date_date = currentDate.getDate();
    const date_hour = currentDate.getHours() < 10 ? `0${currentDate.getHours()}` : currentDate.getHours();
    const date_minute = currentDate.getMinutes() < 10 ? `0${currentDate.getMinutes()}` : currentDate.getMinutes();
    const date_second = currentDate.getSeconds() < 10 ? `0${currentDate.getSeconds()}` : currentDate.getSeconds();

    const returnTime = `${date_year}${date_month}${date_date}${date_hour}${date_minute}${date_second}`;

    const returnObj = {
        time: returnTime.substring(2, returnTime.length),
        key: `${returnTime.substring(2, returnTime.length)}${currentDate.getMilliseconds()}`
    }
    return returnObj;
}

function handlerClickSearchBtn(){
    nameSpaninNav.classList.add("elem-hidden");
    hiddenSpanForSearch.classList.remove('elem-hidden');
}

function handlerSubmitText(event){
    event.preventDefault();

    const userNm = sessionStorage.getItem("user_name");
    const chatOppo = sessionStorage.getItem("chatOpponent");
    const inputText = footerInput.value;
    footerInput.value = "";

    const obj = getDate();
    const chatObjForInsert = new chatCls(obj.key, userNm, inputText, obj.time, chatOppo);
    console.log(inputText);

    sendAjaxForChat(`${PATH_SERVICE}ajax_insert_chat`, chatObjForInsert);
}

function handlerClickSection(){
    event.preventDefault();
    if(!hiddenSpanForSearch.classList.contains("elem-hidden")){
        nameSpaninNav.classList.remove("elem-hidden");
        hiddenSpanForSearch.classList.add('elem-hidden');
        headerInput.value = "";
    }
}

function handlerGoToBackPage(){
    history.back();
}

function handlerTextSearch(event){
    event.preventDefault();

    const target = event.target;
    const searchText = target.querySelector("input").value;

    const obj = {
        user: sessionStorage.getItem("user_name"),
        opponent: sessionStorage.getItem("chatOpponent"),
        text: searchText
    };
    sendAjaxForSearch(`${PATH_SERVICE}ajax_search_chat_text`, obj);
}

// =============================================================

function init(){
    document.write("<script type='text/javascript' src='chat.js'><"+"/script>");

    searchBtninNav.addEventListener("click", handlerClickSearchBtn);
    section.addEventListener("click", handlerClickSection);
    footerInputForm.addEventListener("submit", handlerSubmitText);
    backBtn.addEventListener("click", handlerGoToBackPage);
    headerInputForm.addEventListener("submit", handlerTextSearch);
}
init();