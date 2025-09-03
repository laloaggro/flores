const express = require('express');
const app = express();
const PORT = 5000;

app.get('/', (req, res) => {
  res.json({ message: 'Backend de prueba funcionando' });
});

app.listen(PORT, () => {
  console.log(`Servidor de prueba corriendo en el puerto ${PORT}`);
});