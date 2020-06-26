const loginForm = document.querySelector(".loginForm");
const loginFormBtn = loginForm.querySelector("button");
const loginID = loginForm.querySelector("#loginID");
const loginPW = loginForm.querySelector("#loginPW");

const PATH_LOGIN = "http://localhost:3030/";

// ================================================================

function sendAjaxForLogin(url, obj){
    const data = JSON.stringify(obj);
    let xhr = new XMLHttpRequest();
    xhr.open('POST', url);
    xhr.setRequestHeader('Content-Type', "application/json");
    xhr.send(data);
    xhr.addEventListener('load', () => {
        const result = JSON.parse(xhr.responseText);

        if(result === ""){
            alert("Login Failed!!! Please login again");
            loginID.value = "";
            loginPW.value = "";
            loginID.focus();
        }else{
            const loginResultObj = JSON.parse(result);
            goToChatPage(loginResultObj);
        }
    });
}



// ================================================================

function goToChatPage(loginUserObj){
    sessionStorage.setItem("user_id", loginUserObj.id);
    sessionStorage.setItem("user_name", loginUserObj.name);
    sessionStorage.setItem("user_profileImg", loginUserObj.profileImg);

    location.href="chatRoomList.html";
}

function checkLoginData(id_Value, pw_Value){
    if(id_Value === "") { 
        alert("Please ID Check!");
        loginID.focus();
        return false;
    }else if(pw_Value === ""){
        alert("Please Password Check!");
        loginPW.focus();
        return false;
    }else{
        return true;
    }
}

function handlerSubmitLogin(event){
    event.preventDefault();

    const id_Value = loginID.value;
    const pw_Value = loginPW.value;
    const result = checkLoginData(id_Value, pw_Value);

    if(result){
        const loginDataObj = {
            id: id_Value,
            pw: pw_Value
        };
        sendAjaxForLogin(`${PATH_LOGIN}ajax_login_chat`, loginDataObj);
    }
}

function init(){
    sessionStorage.clear();
    loginID.focus();
    loginFormBtn.addEventListener("click", handlerSubmitLogin);
}
init();