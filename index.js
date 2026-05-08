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

function salvarNotas(notas) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(notas, null, 2));
}

app.get('/notas', (req, res) => {
  const notas = lerNotas();
  res.status(200).json(notas);
});

app.get('/notas/:id', (req, res) => {
  const notas = lerNotas();
  const nota = notas.find(n => n.id === req.params.id);

  if (!nota) {
    return res.status(404).json({ erro: 'Nota não encontrada.' });
  }

  res.status(200).json(nota);
});

app.post('/notas', (req, res) => {
  const { titulo, conteudo } = req.body;

  if (!titulo || !conteudo) {
    return res.status(400).json({ erro: 'Os campos "titulo" e "conteudo" são obrigatórios.' });
  }

  const novas = lerNotas();
  const novaNota = {
    id: uuidv4(),
    titulo,
    conteudo,
    criadoEm: new Date().toISOString(),
    atualizadoEm: new Date().toISOString(),
  };

  novas.push(novaNota);
  salvarNotas(novas);

  res.status(201).json(novaNota);
});

app.put('/notas/:id', (req, res) => {
  const { titulo, conteudo } = req.body;
  const notas = lerNotas();
  const index = notas.findIndex(n => n.id === req.params.id);

  if (index === -1) {
    return res.status(404).json({ erro: 'Nota não encontrada.' });
  }

  if (!titulo && !conteudo) {
    return res.status(400).json({ erro: 'Informe ao menos "titulo" ou "conteudo" para atualizar.' });
  }

  notas[index] = {
    ...notas[index],
    titulo: titulo ?? notas[index].titulo,
    conteudo: conteudo ?? notas[index].conteudo,
    atualizadoEm: new Date().toISOString(),
  };

  salvarNotas(notas);
  res.status(200).json(notas[index]);
});

app.delete('/notas/:id', (req, res) => {
  const notas = lerNotas();
  const index = notas.findIndex(n => n.id === req.params.id);

  if (index === -1) {
    return res.status(404).json({ erro: 'Nota não encontrada.' });
  }

  const removida = notas.splice(index, 1)[0];
  salvarNotas(notas);

  res.status(200).json({ mensagem: 'Nota excluída com sucesso.', nota: removida });
});


app.get('/', (req, res) => {
  res.status(200).json({ status: 'API de Notas funcionando ✓', versao: '1.0.0' });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
