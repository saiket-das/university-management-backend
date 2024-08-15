import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import globalErrorHandler from './app/middlewares/globalErrorHandler';
import notFound from './app/middlewares/notFound';
import router from './app/routes';
import cookieParser from 'cookie-parser';

const app: Application = express();

// parsers
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: ['http://localhost:8000'], credentials: true }));
// app.use(cors({ origin: ['http://localhost:5173'], credentials: true }));

// routes
app.use('/api/v1', router);

app.get('/', (req: Request, res: Response) => {
  res.send('Server is running!');
});

app.use(globalErrorHandler);

// Not found (404) route
app.use(notFound);

export default app;
