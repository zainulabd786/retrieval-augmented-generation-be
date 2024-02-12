
import { body, param, query } from 'express-validator';

const validate = (method: string) => {
  switch (method) {

    case "prompt": {
      return [
        body('text', 'Prompt text is required').trim().notEmpty().isString(),
        body('init').notEmpty().isBoolean(),
      ]
    }

    default: {
      return []
    }
  }
}

export default validate