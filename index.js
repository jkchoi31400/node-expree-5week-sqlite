// Express  사용하도록
var express = require('express');
var app = express();

// sequelize 사용하도록
const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: 'database.sqlite'
  });

 // Comments DB 생성 
const Comments = sequelize.define('Comments', {
  content: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  // Other model options go here
});

// 실행하면 최초 DB 가 생성되도록 하기 위해 async로 구동
(async() => {
await Comments.sync();
console.log("DB 가 준비되었어요!");
})();

// `sequelize.define` also returns the model
console.log(Comments === sequelize.models.Comments); // true


app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing 


// set the view engine to ejs
app.set('view engine', 'ejs');

// use res.render to load up an ejs view file

// index page (첫 페이지를 일단 가져온다)
app.get('/', async function(req, res) {
    // DB 정보를 읽어온다
    const comments = await Comments.findAll();

  res.render('index',{ comments : comments});
});


app.post('/create', async function(req, res) {
    console.log(req.body)
     const {content} = req.body

     // DB에 정보 추가
     await Comments.create({ content: content});

    res.redirect('/')
});

app.post('/update/:id_input', async function(req, res) {
    console.log(req.params)
    console.log(req.body)

     const {content} = req.body
     const {id_input} = req.params
    // DB 에 정보 업데이트
     await Comments.update({ content: content }, {
      where: { 
        id: id_input
      }
    });

    res.redirect('/')
});

app.post('/delete/:id_input', async function(req, res) {
  console.log(req.params)
   const {id_input} = req.params

   // DB 삭제하기
  await Comments.destroy({
    where: {
      id: id_input
    }
  });
  res.redirect('/')
});



app.listen(3000);
console.log('Server is listening on port 3000');