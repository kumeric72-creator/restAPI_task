import { Router } from 'express';
import { getTasks, createTask, updateTask, deleteTask } from '../controllers/taskController';
import { validate, createTaskSchema, updateTaskSchema } from '../middleware/validate';

const router = Router();

router.get('/tasks', getTasks);
router.post('/tasks', validate(createTaskSchema), createTask);
router.put('/tasks/:id', validate(updateTaskSchema), updateTask);
router.delete('/tasks/:id', deleteTask);

export default router;
