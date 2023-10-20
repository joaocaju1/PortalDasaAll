const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));

// Configuração da conexão com o banco de dados
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'bancoportaldasa',
});

// Conectar ao banco de dados
db.connect((err) => {
  if (err) {
    console.error('Erro ao conectar ao banco de dados: ' + err.stack);
    return;
  }
  console.log('Conexão com o banco de dados estabelecida como ID ' + db.threadId);
});

// Rota para o formulário de registro
app.get('/registro', (req, res) => {
  res.sendFile(__dirname + '/registro.html');
});

// Rota para processar o registro
app.post('/processa_registro', (req, res) => {
  const username = req.body.nome;
  const password = req.body.senha;
  const confirmpassword = req.body.confirmpassword;
  const email = req.body.email;
  const telefone = req.body.phone;

  if (!username || !password || !confirmpassword || !email || !telefone) {
    res.send('Todos os campos devem ser preenchidos.');
    return;
  }

  const sql = 'INSERT INTO usuario (username, password, confirmpassword, email, telefone) VALUES (?, md5(?), md5(?), ?, ?)';
  db.query(sql, [username, password, confirmpassword, email, telefone], (err, result) => {
    if (err) {
      console.error('Erro ao registrar o usuário: ' + err);
      res.send('Erro no registro. Tente novamente.');
    } else {
      res.send('Registro bem-sucedido!');
    }
  });
});

// Configure o diretório onde seus arquivos HTML estão localizados
app.use(express.static(__dirname));

// Inicie o servidor na porta 3000
app.listen(port, () => {
  console.log(`Servidor web e servidor Node.js rodando na porta ${port}`);
});
