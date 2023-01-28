const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const app = express();

const data = {
  experience: [],
};

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res, next) => {
  res.redirect('/contact-details');
});

app.get('/contact-details', (req, res, next) => {
  res.render('contact-details', {
    pageTitle: 'Contact Info',
  });
});

app.post('/contact-details', (req, res, next) => {
  const body = req.body;

  data.fname = body.fname;
  data.lname = body.lname;
  data.phone = body.phone;
  data.email = body.email;
  data.address = body.address;

  res.redirect('/summary');
});

app.get('/summary', (req, res, next) => {
  res.render('summary-page', {
    pageTitle: 'Professional Summary',
  });
});

app.post('/summary', (req, res, next) => {
  const body = req.body;

  data.professionalSummary = body.summary;

  res.redirect('/experience');
});

app.get('/experience', (req, res, next) => {
  res.render('experience', {
    pageTitle: 'Work Experience',
  });
});

app.post('/experience', (req, res, next) => {
  const body = req.body;

  data.experience.push({
    jobTitle: body.jtitle,
    company: body.company,
    city: body.city,
    region: body.region,
    startDate: body.sdate,
    endDate: body.edate,
    jobDescription: body.jdescription,
  });
});

app.listen(3000);
