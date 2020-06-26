class charObj{
    constructor(key, user, content, time, opponent){
        this.key = key;
        this.user = user;
        this.content = content;
        this.time = time;
        this.opponent = opponent;
    }
}
// ================================================================================
let express = require('express');
let app = express();
let bodyParser = require('body-parser');
let mysql = require('mysql');

let connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    port: 3306,
    password: 'dmsruf2762',
    database: 'chatdb'
});

connection.connect();
// ================================================================================

app.listen(3030, () => { console.log("Start, express server on port 3030!") });

app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
// app.set('view engine', 'ejs');

// ================================================================================

app.get('/', (req, res) => {
    // res.send("<h1>Hi! zzz...</h1>");
    res.sendFile(__dirname + "/public/login.html");
    // res.sendFile(__dirname + "/public/main.html");
});

// app.post('/email_post', (req, res) => {
//     console.log(req.body.email);
//     // res.send(`<h1>Welcome! ${req.body.email}</h1>`);
//     res.render('email.ejs', {'email' : req.body.email});
// });

app.post('/ajax_get_chat_cont', (req, res) => {
    const user = req.body.user;
    const oppo = req.body.opponent;
    var listarr = [];

    console.log(`select * from chattbl where (user='${user}' and opponent='${oppo}') or (user='${oppo}' and opponent='${user}')`);
    var query = connection.query(`select * from chattbl where (user='${user}' and opponent='${oppo}') or (user='${oppo}' and opponent='${user}')`, (err, rows) => {
        if(err) throw err;
        if(rows[0]) {
            for(let i=0; i<rows.length; i++){
                listarr.push(new charObj(`${rows[i].tbl_key}`, `${rows[i].user}`, `${rows[i].content}`, `${rows[i].time}`, `${rows[i].opponent}`));
            }
            res.json(JSON.stringify(listarr));
            
        }else{
            console.log(`none : ${rows[0]}`);
            res.json("");
        }
    });
});

app.post('/ajax_insert_chat', (req, res) => {
    const tblkey = req.body.key;
    const chatTxt = req.body.text;
    const user = req.body.user;
    const opponent = req.body.opponent;
    const time = req.body.time;

    const query = connection.query(`insert into chattbl (tbl_key, user, content, time, opponent) VALUES ('${tblkey}', '${user}', '${chatTxt}', '${time}', '${opponent}')`, (err, result) => {
      if (err) throw err;
      console.log("1 record inserted");
    });
    res.json("Insert success");
});

app.post('/ajax_login_chat', (req, res) => {
    const loginID = req.body.id;
    const loginPW = req.body.pw;

    const query = connection.query(`select * from logintbl where id='${loginID}' and pw='${loginPW}'`, (err, rows) => {
        if(err) throw err;
        if(rows[0]) {
            const loginSuccessObj = {
                id: rows[0].id,
                // pw: rows[0].pw,
                name: rows[0].name,
                profileImg: rows[0].profileImg
            };
            res.json(JSON.stringify(loginSuccessObj));
            
        }else{
            console.log(`none : ${rows[0]}`);
            res.json("");
        }
    });
});

app.post('/ajax_chat_room_list', (req, res) => {
    const loginID = req.body.id;
    const loginNM = req.body.name;
    const resultObjArr = [];

    const query = connection.query(`select * from (select l.profileImg, c.user, c.content, c.time, c.opponent from logintbl l join chattbl c on c.opponent=l.name) t where t.user='${loginNM}' or t.opponent='${loginNM}' order by t.time desc;`, (err, rows) => {
        if(err) throw err;
        if(rows[0]) {
            for(let i=0; i<rows.length; i++){
                resultObjArr.push({
                    userName: rows[i].user,
                    oppoProfileImg: rows[i].profileImg,
                    time: rows[i].time,
                    content: rows[i].content,
                    opponent: rows[i].opponent
                });
            }
            res.json(JSON.stringify(resultObjArr));
            
        }else{
            console.log(`none : ${rows[0]}`);
            res.json("");
        }
    });
});

app.post('/ajax_profile_img', (req, res) => {
    const arr = req.body;
    let str = "";
    arr.forEach((data, index) => {
        str+= `,"${data}"`;
    });
    str = str.substring(1);
    const resultObjArr = [];

    const query = connection.query(`select name, profileImg from logintbl where name in (${str})`, (err, rows) => {
        if(err) throw err;
        if(rows[0]) {
            for(let i=0; i<rows.length; i++){
                resultObjArr.push({
                    name: rows[i].name,
                    profileImg: rows[i].profileImg
                });
            }
            res.json(JSON.stringify(resultObjArr));
            
        }else{
            console.log(`none : ${rows[0]}`);
            res.json("");
        }
    });
});

app.post('/ajax_search_chat_text', (req, res) => {
    const user = req.body.user;
    const oppo = req.body.opponent;
    const text = req.body.text;
    const resultObjArr = [];

    const query = connection.query(`select * from chattbl where ((user='${user}' and opponent='${oppo}') or (user='${oppo}' and opponent='${user}')) and content like '%${text}%'`, (err, rows) => {
        if(err) throw err;
        if(rows[0]) {
            for(let i=0; i<rows.length; i++){
                resultObjArr.push({
                    user: rows[i].user,
                    profileImg: rows[i].profileImg,
                    time: rows[i].time,
                    content: rows[i].content,
                    opponent: rows[i].opponent
                });
            }
            res.json(JSON.stringify(resultObjArr));
            
        }else{
            console.log(`none : ${rows[0]}`);
            res.json("");
        }
    });
});
