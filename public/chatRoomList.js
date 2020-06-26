const chatRoomListDiv = document.querySelector(".chatRoomListDiv");
const logoutBtn = document.querySelector("header > nav > button");

const PATH_C_R_L = "http://localhost:3030/";
let USER_ID_SS = "";
let USER_NAME_SS = "";
const chatRoomListObjList = [];
const chatRoomListNameList = [];
let profileImgOfName = [];

// ===============================================================================
function handlerGoToChatPage(event){
    let clickedElement = event.target;

    if(!clickedElement.getAttribute("data-opponent")){
        clickedElement = clickedElement.parentNode;
    }
    sessionStorage.setItem("chatOpponent", clickedElement.getAttribute("data-opponent"));
    sessionStorage.setItem("chatOpponentImg", clickedElement.getAttribute("data-oppo-img"));

    location.href = "main.html";
}

function paintChatRoomList(chatRoomListObj){
    const userName = chatRoomListObj.userName;
    // const oppo_img = chatRoomListObj.oppoProfileImg;
    let oppo_img = chatRoomListObj.oppoProfileImg;
    const chatTxt = chatRoomListObj.content;
    const opponent = chatRoomListObj.opponent;
    let time = chatRoomListObj.time;
    time = `20${time.substr(0, 2)}-${time.substr(2, 2)}-${time.substr(4, 2)}\n${time.substr(6, 2) > 12 ? parseInt(time.substr(6, 2))-12 : time.substr(6, 2)}:${time.substr(8, 2)}:${time.substr(10, 2)}`;

    // =================================================
    const List_elem_li = document.createElement("li");
    const ListImg_elem_span = document.createElement("span");
    const Cont_elem_div = document.createElement("div");
    const ContNm_elem_span = document.createElement("span");
    const ContTxt_elem_span = document.createElement("span");
    const Time_elem_span = document.createElement("span");
    // =================================================
    List_elem_li.classList.add("chatRoomList");
    ListImg_elem_span.classList.add("listImgSpan");
    Cont_elem_div.classList.add("listContentDiv");
    Time_elem_span.classList.add("listTimeSpan");
    ContNm_elem_span.classList.add("listContentNm");
    ContTxt_elem_span.classList.add("listContentCont");
    // =================================================
    const nameSpanTxt = (opponent !== USER_NAME_SS) ? opponent : userName; 
    for(let i=0; i<profileImgOfName.length; i++){
        if(profileImgOfName[i].name === nameSpanTxt){
            oppo_img = profileImgOfName[i].profileImg;
            break;
        }
    }

    const image = new Image();
    image.src = `images/${oppo_img}`; 
    image.classList.add("progileImg");
    ListImg_elem_span.appendChild(image);
    
    ContNm_elem_span.innerText = nameSpanTxt; 
    ContTxt_elem_span.innerText = chatTxt;
    Time_elem_span.innerText = time;

    // Cont_elem_div.setAttribute("data-opponent", objOpponent);
    Cont_elem_div.setAttribute("data-opponent", nameSpanTxt);
    Cont_elem_div.setAttribute("data-oppo-img", oppo_img);
    ContTxt_elem_span.addEventListener("click", handlerGoToChatPage);
    ContNm_elem_span.addEventListener("click", handlerGoToChatPage);
    Cont_elem_div.addEventListener("click", handlerGoToChatPage);
    // =================================================
    Cont_elem_div.appendChild(ContNm_elem_span);
    Cont_elem_div.appendChild(ContTxt_elem_span);

    List_elem_li.appendChild(ListImg_elem_span);
    List_elem_li.appendChild(Cont_elem_div);
    List_elem_li.appendChild(Time_elem_span);
    // =================================================
    chatRoomListDiv.appendChild(List_elem_li);
}

function putDataChatRoomList(resultObj){
    const opponent = resultObj.opponent;
    const userName = resultObj.userName;
    let oppoForSearch = "";

    if(userName === USER_NAME_SS){
        oppoForSearch = opponent;
    }else{
        oppoForSearch = userName;
    }

    if(!chatRoomListNameList.includes(oppoForSearch)){
        chatRoomListObjList.push(resultObj);
        chatRoomListNameList.push(oppoForSearch);
    }
}

function sendAjaxForProfileImg(url){
    const data = JSON.stringify(chatRoomListNameList);
    let xhr = new XMLHttpRequest();
    xhr.open('POST', url);
    xhr.setRequestHeader('Content-Type', "application/json");
    xhr.send(data);
    xhr.addEventListener('load', () => {
        const result = JSON.parse(xhr.responseText);

        if(result !== ""){
            const resultObjArr = JSON.parse(result);
            resultObjArr.forEach((resultObj) => {
                profileImgOfName.push({
                    name: resultObj.name,
                    profileImg: resultObj.profileImg
                });
            });

            // chat room list Create!!
            chatRoomListObjList.forEach((chatRoomListObj) => {
                paintChatRoomList(chatRoomListObj);
            });
        }
    });
}

function sendAjaxForChatRoomList(url, obj){
    const data = JSON.stringify(obj);
    let xhr = new XMLHttpRequest();
    xhr.open('POST', url);
    xhr.setRequestHeader('Content-Type', "application/json");
    xhr.send(data);
    xhr.addEventListener('load', () => {
        const result = JSON.parse(xhr.responseText);

        if(result !== ""){
            const resultObjArr = JSON.parse(result);
            resultObjArr.forEach((resultObj) => {
                putDataChatRoomList(resultObj);
            });

            // profileImg get!!
            sendAjaxForProfileImg(`${PATH_C_R_L}ajax_profile_img`);
        }
    });
}


function handlerClickLogout(){
    const result = confirm("Are you sure you want to log out?");
    if(result){
        location.href = "login.html";
    }
}

// ===============================================================================

function init(){
    USER_ID_SS = sessionStorage.getItem("user_id");
    USER_NAME_SS = sessionStorage.getItem("user_name");

    const obj = {
        id: USER_ID_SS,
        name: USER_NAME_SS
    };
    sendAjaxForChatRoomList(`${PATH_C_R_L}ajax_chat_room_list`, obj);

    logoutBtn.addEventListener("click", handlerClickLogout);
}
init();