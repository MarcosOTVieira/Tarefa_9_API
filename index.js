const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'notas.json');

app.use(cors());
app.use(express.json());

function lerNotas() {
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify([], null, 2));
  }
  const conteudo = fs.readFileSync(DATA_FILE, 'utf-8');
  return JSON.parse(conteudo);
}

app.get('/', (req, res) => {
  res.status(200).json({ status: 'API de Notas funcionando ✓', versao: '1.0.0' });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
