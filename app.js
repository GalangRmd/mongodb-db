const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const { body, validationResult, check } = require('express-validator');
const methodOverride = require('method-override');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');

require('./utils/db');
const Contact = require('./model/contact');

const app = express();
const port = 3000;

//setup method override
app.use(methodOverride('_method'));

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
      //halaman tambah contak
  app.get('/contact/add', (req, res) => {
   res.render('add-contact', {
    title : 'Tambah Data Contact',
    layout : 'layouts/main-layout',
  });
});

//proses data contact
app.post('/contact', [ 
  body('nama').custom( async (value) => { 
    const duplikat = await Contact.findOne({nama: value}); 
    if(duplikat) { 
      throw new Error('Nama contact sudah digunakan!'); 
    } 
    return true; 
  }), 
  check('email', 'Email tidak valid!').isEmail(), 
  check('noHP', 'No HP tidak valid!!').isMobilePhone('id-ID'),
  ], (req, res) => { 
   const errors = validationResult(req); 
   if(!errors.isEmpty()) { 
    // return  res.status(404).json({ errors: errors.array() }); 
   res.render('add-contact', { 
    title: 'Form Tambah Data Contact', 
    layout: 'layouts/main-layout', 
    errors: errors.array(), 
   }) 
  }else{
    Contact.insertMany(req.body) .then(function (error) {
      //kirimkan flash masage
    req.flash('msg', 'Data Contact Berhasil Ditambahkan!');
    res.redirect('/contact') 
      })
  }
}
);
//delete
// app.get('/contact/delete/:nama', async (req, res) => {
//   const contact = await Contact.findOne({ nama: req.params.nama });
//   if (!contact) {
//     res.status(404);
//     res.send('<h1>404</h1>');
//   } else {
//     Contact.deleteOne({ _id: contact._id }).then((result) => {
//       req.flash('msg', 'Data Contact Berhasil dihapus');
//       res.redirect('/contact');
//     })
//   }
// });

//ini nyoba
app.delete('/contact',  (req,res) => {
  Contact.deleteOne({ nama: req.body.nama }).then((result) => {
     req.flash('msg', 'Data Contact Berhasil dihapus');
     res.redirect('/contact');
   });
});

//form ubah data contact
app.get('/contact/edit/:nama', async (req, res) => { 
  const contact = await Contact.findOne({nama: req.params.nama}); 
 
  res.render('edit-contact', { 
    title: 'Form tambah data contact', 
    layout: 'layouts/main-layout', 
    contact,  
  }) 
})

//proses ubah data
app.put('/contact', [ 
  body('nama').custom(async (value, {req}) => { 
    const duplikat = await Contact.findOne({nama: value}); 
    if(value !== req.body.oldNama && duplikat) { 
      throw new Error('Nama contact sudah digunakan!'); 
    } 
    return true; 
  }), 
  check('email', 'Email tidak valid!').isEmail(), 
  check('noHP', 'No HP tidak valid!!').isMobilePhone('id-ID') 
  ], (req, res) => { 
   const errors = validationResult(req); 
   if(!errors.isEmpty()) { 
   res.render('edit-contact', { 
    title: 'Form Ubah Data Contact', 
    layout: 'layouts/main-layout', 
    errors: errors.array(), 
    contact: req.body 
   }) 
  } else { 
    Contact.updateOne( 
      { _id: req.body._id}, 
      { 
        $set: { 
          nama: req.body.nama, 
          email: req.body.email, 
          nohp: req.body.nohp,  
        } 
      }  
      ).then((result) => { 
        //kirimkan flash message 
       req.flash('msg', 'Data Contact Berhasil DiUbahhhh!') 
       res.redirect('/contact') 
      }) 
   } 
 } 
)


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