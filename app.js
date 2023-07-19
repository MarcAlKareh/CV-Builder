const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const expressSession = require('express-session');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');

dotenv.config();

const { Configuration, OpenAIApi } = require('openai');

const openAIConfig = new Configuration({
  apiKey: process.env.API_KEY,
});

const openai = new OpenAIApi(openAIConfig);

const isProduction = process.env.NODE_ENV === 'production';
const secret = process.env.SECRET || 'some secret';

const app = express();

// const data = {
//   experience: [], no need for that with session
// };

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

app.use(cookieParser());

// might need to configure mongodb session store
app.use(
  expressSession({
    secret: secret,
    saveUninitialized: true,
    resave: false,
    cookie: {
      maxAge: 1000 * 3600 * 24 * 14, // 14 days  for cookie to expire
      httpOnly: true,
      secure: isProduction ? true : false,
      sameSite: isProduction ? 'none' : 'lax',
    },
  })
);

app.use((req, res, next) => {
  //init session data;
  if (!req.session.data) {
    req.session.data = {
      experience: [],
    };
  }
  next();
});

app.get('/', (req, res, next) => {
  res.redirect('/contact-details');
});

app.get('/contact-details', (req, res, next) => {
  res.render('contact-details', {
    pageTitle: 'Contact Info',
    data: req.session.data,
  });
});

app.post('/contact-details', (req, res, next) => {
  const body = req.body;

  req.session.data.fname = body.fname;
  req.session.data.lname = body.lname;
  req.session.data.phone = body.phone;
  req.session.data.email = body.email;
  req.session.data.profession = body.profession;
  req.session.data.address = body.address;

  res.redirect('/summary');
});

app.get('/summary', (req, res, next) => {
  res.render('summary-page', {
    pageTitle: 'Professional Summary',
    data: req.session.data,
  });
});

app.post('/summary', (req, res, next) => {
  const body = req.body;

  req.session.data.professionalSummary = body.summary;

  res.redirect('/experience');
});

app.get('/summary-ai', async (req, res, next) => {
  const { input } = req.query;

  const resAi = await openai.createChatCompletion({
    model: 'gpt-3.5-turbo',
    messages: [{ role: 'user', content: input }],
  });

  // console.log(resAi.data.choices[0].message.content);

  res.send({
    reply: resAi.data.choices[0].message.content,
  });
});

app.get('/experience', (req, res, next) => {
  //index of most recent job, if fields don't exists it doesn't matter
  const mostRecentIndex = req.session.data.experience.length - 1;
  res.render('experience', {
    pageTitle: 'Work History',
    mainHeader: 'Tell us a little bit about your most recent job',
    data: req.session.data,
    index: mostRecentIndex,
  });
});

app.post('/experience', (req, res, next) => {
  const body = req.body;

  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  req.session.data.experience.push({
    jobTitle: body.jtitle,
    company: body.company,
    city: body.city,
    region: body.region,
    startDate: `${months[new Date(body.sdate).getMonth()]}, ${new Date(
      body.sdate
    ).getFullYear()}`,
    endDate: `${months[new Date(body.edate).getMonth()]}, ${new Date(
      body.edate
    ).getFullYear()}`,
    jobDescription: body.jdescription,
  });

  res.redirect('/work-history');
});

app.get('/work-history', (req, res, next) => {
  !req.session.data.experience.length
    ? res.redirect('/experience')
    : res.render('work-history', {
        pageTitle: 'Work History',
        jobs: req.session.data.experience,
      });
});

app.get('/another-position', (req, res, next) => {
  res.render('experience', {
    pageTitle: 'Work History',
    mainHeader: 'Tell us about another job',
    data: req.session.data,
  });
});

app.get('/delete', (req, res, next) => {
  const { jobName } = req.query;

  // Delete job from experience array
  const index = req.session.data.experience.findIndex(
    obj => obj.jobTitle === jobName
  );
  req.session.data.experience.splice(index, 1);

  !req.session.data.experience.length
    ? res.send({ url: '/experience' })
    : res.send({ url: '/work-history' });
});

app.get('/education', (req, res, next) => {
  res.render('education', {
    pageTitle: 'Education',
    data: req.session.data,
  });
});

app.post('/education', (req, res, next) => {
  const body = req.body;
  req.session.data.education = body.education;
  res.redirect('/skills');
});

app.get('/skills', (req, res, next) => {
  res.render('skills', {
    pageTitle: 'Skills',
    data: req.session.data,
  });
});

app.post('/skills', (req, res, next) => {
  const body = req.body;

  const skills = body.skills
    .replace(' ', '')
    .split(',')
    .filter(skill => skill);
  const languages = body.languages
    .replace(' ', '')
    .split(',')
    .filter(language => language);

  req.session.data.skills = skills;
  req.session.data.languages = languages;

  res.redirect('/final-resume');
});

app.get('/final-resume', (req, res, next) => {
  res.render('final', {
    pageTitle: 'Final Resume',
    data: req.session.data,
  });
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log('listening on port', 3000);
});
