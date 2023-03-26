import { Request, Response, NextFunction } from 'express';

interface Page {
  page: number;
  limit: number;
}

export function paginate(modelName: string) {
  return (req: Request, res: Response, next: NextFunction) => {
    let model;

    switch(modelName) {
      case 'blockchain':
        model = req.app.locals[modelName].chain;
        break;
      case 'txpool':
        model = req.app.locals[modelName];
        break;
    }

    const page = +req.query.page! || 1;
    const limit = +req.query.limit! || model.length;

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const result: {
      prev?: Page;
      next?: Page;
      data?: Array<object>;
    } = {};

    if (startIndex > 1) {
      result.prev = { page: page - 1, limit };
    }

    if (endIndex < model.length) {
      result.next = { page: page + 1, limit };
    }

    if (model.length > 0) {
      result.data = model.slice(startIndex, endIndex);
    }

    res.locals.result = result;
    next();
  };
}
