const express = require('express');
const { default: mongoose } = require('mongoose');
const morgan = require('morgan');  //3rd Party middleware
const Blog = require('./models/blog');

//express app
const app = express();

// mongodb connection
const dbURI = 'mongodb+srv://Jid_2001:passMongodb@cluster0.dlzzmiu.mongodb.net/Node_tut?retryWrites=true&w=majority'

mongoose.connect(dbURI)
    .then((results)=>console.log('connected to the database'))
    .catch((err)=>console.log(err));

mongoose.connect(dbURI)
.then((results)=>app.listen(3000))
.catch((err)=>console.log(err));
// Middleware to access static files

app.use(express.static('public'));
app.use(express.urlencoded({ extended : true })); 
app.use(morgan('dev')); // morgan
app.use((req, res, next) =>{
  res.locals.path = req.path;
  next();
})


// register view engine
app.set('view engine','ejs');
// app.listen(3000, 'localhost'); //localhost is optional

//  mongoose & mongo tests
app.get('/add-blog', (req, res) => {
    const blog = new Blog({
      title: 'This is a new blog',
      snippet: 'This is the  about my new blog',
      body: 'more about my new blog'
    })
  
    blog.save()
      .then(result => {
        res.send(result);
      })
      .catch(err => {
        console.log(err);
      });
  });

  // Retriving all the blogs using find method on Blog instance

  app.get('/all-blogs', (req, res) => {

    Blog.find()
      .then(result => {
        res.send(result)
      })
      .catch(err => {
        console.log(err)
      });

        
  });

  // Finding single blog using find method on Blog instance

  app.get('/single-blog', (req, res) => {
      // mongoose.Blog.findById
      
      Blog.findById("4208502f8e0bdce328c51ea")
        .then(result => {
          res.send(result)
        })
        .catch(err => {
          console.log(err)
        });

      });


app.get('/', (req, res)=> {
    // res.send('<p> Home Page </p>')
    // res.sendFile('./views/index.html',{root : __dirname});
    // const blogs = [
    //     {title: 'Yoshi finds eggs', snippet: 'Lorem ipsum dolor sit amet consectetur'},
    //     {title: 'Mario finds stars', snippet: 'Lorem ipsum dolor sit amet consectetur'},
    //     {title: 'How to defeat bowser', snippet: 'Lorem ipsum dolor sit amet consectetur'},
    //   ];

    // res.render('index', {title : 'Home Page',blogs});

    res.redirect('/blogs');

});

app.get('/about', (req, res)=> {
    // res.send('<p> Home Page </p>')
    // res.sendFile('./views/about.html',{root : __dirname});

    res.render('about',{title: 'About'});


});

// Reedirects  in express
app.get('/about-us', (req, res)=> {

    res.redirect('/about'); 
});

// blog routes
app.get('/blogs', (req, res)=> {
    Blog.find().sort({createdAt: -1})
      .then((result) =>{
    res.render('index',{title: 'All Blogs', blogs : result})
  })
      .catch(err =>{
        console.log(err);
      });
      
});

// creating a new blog
app.get('/blogs/create', (req, res)=> {
  res.render('create',{title: 'Create new Bolg '});
});

// handling post request for blog

app.post('/blogs' ,(req, res)=> {
    const blog = new Blog(req.body);

    blog.save()
      .then((result) =>{
        res.redirect('/blogs')
      })
      .catch(err =>{
        console.log(err)
      });
});

// handling post request for blog

app.get('/blogs/:id',(req, res)=>{
  const id = req.params.id;

  Blog.findById(id)
    .then((result) =>{
    res.render('details', {title: "Blog content", blogs : result})
    })
    .catch(err =>{
      console.log(err)
    });


});


app.delete('/blogs/:id', (req, res) => {
  const id = req.params.id;
  
  Blog.findByIdAndDelete(id)
    .then(result => {
      res.json({ redirect: '/blogs' });
    })
    .catch(err => {
      console.log(err);
    });
});

// 404 Page Not Found


app.use((req, res)=> {
    // res.sendFile('./views/404.html',{root : __dirname});
    // res.status(404).sendFile('./views/404 .html',{root : __dirname});


    res.status(404).render('404',{title : '404 Page Not Found'}); 
});