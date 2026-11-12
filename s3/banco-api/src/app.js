import express from 'express';
import cors from 'cors';
import clientesRouter from './routes/clientes.js';
import contasRouter from './routes/contas.js';
import { logger } from './middleware/logger.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();

app.use(cors({
  origin: ['http://localhost:5500', 'http://127.0.0.1:5500'],
}));
app.use(express.json());
app.use(logger);

app.get('/', (req, res) => {
  res.json({ api: 'Banco API', versao: '1.0.0', rotas: ['/clientes', '/contas'] });
});

app.use('/clientes', clientesRouter);
app.use('/contas', contasRouter);

app.use((req, res) => {
  res.status(404).json({ erro: `Rota ${req.method} ${req.url} não existe` });
});

app.use(errorHandler);

export default app;
