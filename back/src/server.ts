import express, { Request, Response } from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

const createValuesSchema = z.object({
  senha: z.string(),
});

app.get('/password', async (req: Request, res: Response) => {
  try {
    const values = await prisma.fechaduraSenha.findMany();
    res.json({ values });
  } catch (error) {
    console.error('erro ao retornar os valores:', error);
    res.status(500).send('erro ao retornar valor');
  }
});

app.post('/password', async (req: Request, res: Response) => {
  try {
    const { senha } = createValuesSchema.parse(req.body);

    const createdValue = await prisma.fechaduraSenha.create({
      data: { senha },
    });

    res.status(201).json({ createdValue });
  } catch (error) {
    console.error('dados invalido:', error);
    res.status(400).send('dados invalido');
  }
});

app.delete('/password/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);

    if (isNaN(id)) {
      return res.status(400).send('ID inválido');
    }

    const deletedValue = await prisma.fechaduraSenha.delete({
      where: { id },
    });

    res.status(200).json({ deletedValue });
  } catch (error) {
    console.error('erro ao deletar o valor:', error);
  }
});

const PORT = process.env.PORT || 3333;
app.listen(PORT, () => {
  console.log(`HTTP server rodando na porta: ${PORT}`);
});
