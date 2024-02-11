
import { body, param, query } from 'express-validator';

const validate = (method: string) => {
  switch (method) {
    case 'index': {
      return [
        body('title', 'title cannot be empty').trim().notEmpty().isString(),
        param('id').notEmpty().isInt(),
        query('type').trim().notEmpty().isString()
      ]
    }

    default: {
      return []
    }
  }
}

export default validate