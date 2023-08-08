const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/galang')
.then(() =>   
console.log('Connected!'));


// // Menambah 1 data
// const contact1 = new Contact({
//     nama: 'Galang',
//     noHP: '08321333412',
//     email: 'galangganteng@gmail.com',
// });
// //simpan ke collections
// contact1.save().then((contact)=> console.log(contact));