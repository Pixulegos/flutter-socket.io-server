const { io } = require('../index');
const Bands = require('../models/bands');
const Band = require('../models/band');

const bands = new Bands();

bands.addBand( new Band('Queen'));
bands.addBand( new Band('Bon Jovi'));
bands.addBand( new Band('Metallica'));
bands.addBand( new Band('Hots'));

//Socket Messages
io.on('connection', client => {
  console.log('Client connected');

  client.emit('active-bands', bands.getBands());

  client.on('disconnect', () => {
      console.log('Client disconnected')
    });
  client.on('message', (payload) => { 
      console.log('Message', payload);

      io.emit('message', {admin: 'New message'});
    });
  client.on('new-msg', (msg) =>{
      console.log(msg);
      //io.emit('new-msg', msg); //Emite a todos
      client.broadcast.emit('new-msg', msg); //Emite a todos, menos al remitente
  });
  client.on('vote-band', (payload) =>{
      console.log(payload);

      bands.voteBand(payload.id);
      io.emit('active-bands', bands.getBands());
  });
  client.on('add-band', (payload) =>{
      console.log(payload);

      bands.addBand(new Band(payload.name));
      io.emit('active-bands', bands.getBands());
  });
  client.on('delete-band', (payload) =>{
      console.log(payload);

      bands.deleteBand(payload.id);
      io.emit('active-bands', bands.getBands());
  });
});