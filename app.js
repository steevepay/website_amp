require('dotenv').config()
var express = require('express');
const nodemailer = require('nodemailer');
var bodyParser = require('body-parser')

var app = express();
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 
app.use(express.json());       // to support JSON-encoded bodies
// app.use(express.urlencoded()); // to support URL-encoded bodies

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    type: 'OAuth2',
    user: process.env.GMAIL_ADDRESS,
    clientId: process.env.GMAIL_OAUTH_CLIENT_ID,
    clientSecret: process.env.GMAIL_OAUTH_CLIENT_SECRET,
    refreshToken: process.env.GMAIL_OAUTH_REFRESH_TOKEN,
    accessToken: process.env.GMAIL_OAUTH_ACCESS_TOKEN,
    expires: Number.parseInt(process.env.GMAIL_OAUTH_TOKEN_EXPIRE, 10),
  },
})

transporter.verify(function(error, success) {
  if (error) {
    console.log(error);
  } else {
    console.log("Server is ready to take our messages");
  }
});
var multer  = require('multer');
var multipart = multer();

app.use('/', express.static('amp'));

app.post('/send', multipart.fields([]), (req, res) => {
  res.setHeader('Content-type', 'application/json');
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*.ampproject.org');
  res.setHeader('AMP-Access-Control-Allow-Source-Origin', 'http://' + req.headers.host);
  res.setHeader('Access-Control-Expose-Headers', 'AMP-Access-Control-Allow-Source-Origin');

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: process.env.EMAIL_TO,
    subject: `New Message Steeve Website AMP - ${req.body.name} - ${req.body.email}`,
    text: `${req.body.name} - ${req.body.email} - ${req.body.message}`,
    replyTo: `${req.body.email}`,
    html: `<h2>New Message from Steeve Website</h2> \
          from: ${req.body.email} <br/> \
          name: ${req.body.name} <br/> \
          message: <br/><br/>${req.body.message}`
  }

  transporter.sendMail(mailOptions, function(err, res) {
    if (err) {
      console.error('Something went wrong: ', err);
    } else {
      console.log('Mail sent!')
    }
  })
  res.json("sent")
});


const PORT = process.env.PORT | 3000;

app.listen(PORT, function () {
  console.log(`Server listening on port ${PORT}!`);
});