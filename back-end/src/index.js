import express from 'express';

const app = express();

app.listen(3000, () => {
    console.log("Servidor na porta 3000");
});

app.get('/', (req, res) =>
    res.send('<h1 style="color: green">CRIANDO UM SERVIDOR COM EXPRESS.JS</h1>')
);
