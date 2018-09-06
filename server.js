const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const Chatkit = require('pusher-chatkit-server')

const app = express()

const chatkit = new Chatkit.default({
  instanceLocator: 'v1:us1:35f1e2b9-c817-4c65-887d-da25c4d69387',
  key: '415592b5-e652-4a98-ac04-59baa47ae710:QNMHvRzNkrYQUdG4Ejq4+Dd/01VjyGovjQnmp4STe+g=',
})

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cors())

//create new user
app.post('/users', (req, res) => {
  const { username } = req.body
  chatkit
    .createUser({
      id: username,
      name: username
    })
    .then(() => res.sendStatus(201))
    .catch(error => {
      if (error.error_type === 'services/chatkit/user_already_exists') {
        res.sendStatus(200)
      } else {
        res.status(error.status).json(error)
      }
    })
})
//create new Room
app.post('/createTeam', (req, res) => {
  const data = req.body
  console.log(data);
  
  chatkit.createRoom({
    creatorId: data.username,
    name: data.teamname,
  })
  .then(() => res.send('Room Created Successfully'))
  .catch((err) => {
    console.log(err);
  });
  
})

//get User Rooms
app.get('/getTeam', (req, res) => {
  chatkit.getUserRooms({
    userId: 'manjusha',
  })
  .then((response) => {
    const  data  = response;
    res.send({'data':'test', 'response': data});
    console.log(data);
  }).catch((err) => {
    console.log(err);
  });
})

app.post('/authenticate', (req, res) => {
  const authData = chatkit.authenticate({ userId: req.query.user_id })
  res.status(authData.status).send(authData.body);
  res.end();
})

const PORT = 3001;
app.listen(PORT, err => {
  if (err) {
    console.error(err)
  } else {
    console.log(`Running on port ${PORT}`)
  }
})
