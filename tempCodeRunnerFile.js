

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.get('*', (req, res) => {