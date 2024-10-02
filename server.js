const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const connectDB = require('./config/db');
const documentRoutes = require('./routes/documentRoute');
const { handleSocket } = require('./utils/socketHandler');
const errorHandler = require('./middleware/errorHandler'); // Importa o middleware de erro

require('dotenv').config();

connectDB();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

app.use(express.json());
app.use(helmet());

// Limite de requisições por IP
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // Limita a 100 requisições por janela de 15 minutos
});
app.use(limiter);

app.use('/api/documents', documentRoutes);

io.on('connection', (socket) => handleSocket(socket, io));

app.use(errorHandler);

server.listen(4000, () => {
  console.log('Servidor rodando na porta 4000');
});
