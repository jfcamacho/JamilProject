const express = require('express');
const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client('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');
let lastToken = '';

const app = express();
app.use(express.json());

const port = process.env.port || 3000

app.listen(port, () => {
    console.log(`Servidor corriendo en el puerto ${port}`);
})

app.post('/api', (req, res) => {
    res.send(req.body)
    console.log("EL TOKEN ES.:");
    lastToken = req.body['token']
    verify()
})

app.use( express.static('public'))

async function verify() {
  const ticket = await client.verifyIdToken({
      idToken: lastToken,
      audience: '130905455709-1e6l7afs6in946u993gmca02g4doql6f.apps.googleusercontent.com',  // Specify the CLIENT_ID of the app that accesses the backend
      // Or, if multiple clients access the backend:
      //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
  });
  const payload = ticket.getPayload();
  const userid = payload['sub'];
  console.log(payload);
  // If request specified a G Suite domain:
  // const domain = payload['hd'];
}