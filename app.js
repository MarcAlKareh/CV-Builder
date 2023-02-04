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
app.use(express.json());

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
    pageTitle: 'Work History',
    mainHeader: 'Tell us a little bit about your most recent job',
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

  res.redirect('/work-history');
});

app.get('/work-history', (req, res, next) => {
  res.render('work-history', {
    pageTitle: 'Work History',
    jobs: data.experience,
  });
});

app.get('/another-position', (req, res, next) => {
  res.render('experience', {
    pageTitle: 'Work History',
    mainHeader: 'Tell us about another job',
  });
});

app.get('/delete', (req, res, next) => {
  const { jobName } = req.query;
  console.log(jobName);

  // Delete job from experience array
  const index = data.experience.findIndex(obj => obj.jobTitle === jobName);
  data.experience.splice(index, 1);

  !data.experience.length
    ? res.send({ url: '/experience' })
    : res.send({ url: '/work-history' });
});

app.listen(3000);
