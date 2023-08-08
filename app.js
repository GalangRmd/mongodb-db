const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const { body, validationResult, check } = require('express-validator');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');

require('./utils/db');
const Contact = require('./model/contact');

const app = express();
const port = 3000;
app.set('view engine', 'ejs');

//third party middleware
app.use(expressLayouts);
app.use(express.static('public'));
app.use( express.urlencoded({ extended: true }));


app.use(cookieParser('secret'));
app.use(session({
  cookie:{ maxAge:6000},
  secret: 'secret',
  resave: true,
  saveUninitialized: true,
}));
app.use(flash());


//halaman Home
app.get('/', (req, res) => {
    // res.sendFile('./index.html', {root:__dirname});
    const siswa = [
      {
        nama : 'galang Ramadhan',
        email : 'galangramad1113@gmail.com'
      },
      {
        nama : 'galang Ramadh',
        email : 'galangramad1115@gmail.com'
      },
      {
        nama : 'galang sitampan',
        email : 'galangramadhannn18@gmail.com'
      }
    ];
    res.render('index',{
        layout: 'layouts/main-layout',
        nama: 'galang', 
        title: 'halaman home',
        siswa,
      });
      });

      //halaman about
      app.get('/about', (req, res) => {
        // res.sendFile('views/about', {root:__dirname});
        res.render('about',{
          layout: 'layouts/main-layout',
          title: 'halaman about',
        });
      });

      //halaman kontak
      app.get('/contact', async (req, res) => { 
        const contacts = await Contact.find(); 
         
        res.render('contact', { 
          layout: 'layouts/main-layout', 
          title: 'Halaman Contact', 
          contacts, 
          msg: req.flash('msg') 
        
        }); 
   
      }) 
      //detail
      app.get('/contact/:nama', async (req, res) => {
        const contact = await Contact.findOne({nama: req.params.nama});
        res.render('detail',{
          layout: 'layouts/main-layout',
          title: 'Detail Contact',
          contact,
        })
      });

app.listen(port, () =>{
    console.log(`Mongo Contact App | Listening at http://localhost:${port}`);
}) 