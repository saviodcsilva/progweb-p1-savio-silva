import express from 'express';
import clientesRouter from './routes/clientes.js';
import pedidosRouter from './routes/pedidos.js';
import { logger } from './middleware/logger.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();

app.use(express.json());
app.use(logger);

app.get('/', (req, res) => {
  res.json({ api: 'Loja Esportiva API', versao: '1.0.0', rotas: ['/clientes', '/pedidos'] });
});

app.use('/clientes', clientesRouter);
app.use('/pedidos', pedidosRouter);

app.use((req, res) => {
  res.status(404).json({ erro: `Rota ${req.method} ${req.url} não existe` });
});

app.use(errorHandler);

export default app;
