const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const hbs = require('hbs');
const req = require('express/lib/request');
app.set("view engine", "hbs");
var objecte = {};
var answerobject = {};
app.use(express.urlencoded());
app.use(express.json());
var id = 0;
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});
app.post('/ashu', (req, res) => {
  res.send(req.body);
  res.end();
})
app.post("/jay", (req, res) => {
  res.send(req.body);
  req.end();
})

app.get('*', (req, res) => {
  let obk = objecte[(req.url).replace("/", "")];
  let idofsheet = obk["data"].id;
  obk = obk.q_sheet;
  let oans = {};
  for (let key in obk) {
    let elem = obk[key];
    oans[key] = elem.ans;
    elem.ans = undefined;
    obk[key] = elem;
  }
  res.render("main", { id: idofsheet, data: JSON.stringify(obk) });
  for (let key in obk) {
    let elem = obk[key];
    elem.ans = oans[key];
    obk[key] = elem;
  }
  // res.end();
})

io.on('connection', (socket) => {
  socket.on("senddata", (data) => {
    let obj = {};
    obj.q_sheet = data;
    obj.data = {
      id: socket.id
    }
    console.log(obj);

    objecte["quizeashutoshnishad" + id++] = obj;
    socket.emit("linkfor" , "quizeashutoshnishad"+(id-1));
    console.log(obj);
  })

  socket.on("send-data", (obj) => {
    // console.log(obj);

    answerobject[socket.id] = {
      answer_sheet: obj,
      info: {
        id: socket.id,
        marks: -1
      }
    };
    cheakanswersheet(socket.id);

    socket.emit("nomber" , answerobject[socket.id]);
  })
});

function cheakanswersheet(id) {
  let obj = answerobject[id];
  let answer_sheet = obj.answer_sheet;
  let ansswers = answer_sheet.answer;
  let q_book = answer_sheet["data"].q_book;
  let marks = 0;
  let answer_chack = {};
  for (let key in objecte) {
    if (objecte[key].data.id == q_book) {
      let qs = objecte[key];
      for (let d in ansswers) {
        if (ansswers[d].ans == qs.q_sheet[d].ans) {
          answer_chack[d] = {
            status: "right",
            marks: Number(qs.q_sheet[d].marks)
          }

          marks = marks + Number(qs.q_sheet[d].marks);
        } else {
          answer_chack[d] = {
            status: "wrong",
            marks: 0
          }
        }

      }
    }
    break;
  }

  answer_sheet.result = answer_chack;
  obj.info.marks = marks;
  answerobject[id] = obj;
  console.log(obj);
}
server.listen(3000, () => {
  console.log('listening on *:3000\nhttp://localhost:3000');
});