const express = require('express');
const app = express();
const morgan = require('morgan');

// Congiguraciones
app.set('port', process.env.PORT || 3000);
app.set('json spaces', 2);

// Middlewares
app.use(morgan('dev'));
app.use(express.urlencoded({extended: false}));
app.use(express.json());

// Routes
app.use(require('./src/routes/index'))
app.use(express.static('public'));

//Empezando el servidor
app.listen(app.get('port'), () => {
    console.log(`🌎 Servidor corriendo en el puerto ${app.get('port')}`)
});