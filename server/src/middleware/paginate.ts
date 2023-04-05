import { Request, Response, NextFunction } from 'express';

interface Page {
  page: number;
  limit: number;
}

export function paginate(modelName: string, reverse?: boolean) {
  return (req: Request, res: Response, next: NextFunction) => {
    let model;

    switch (modelName) {
      case 'blockchain':
        model = req.app.locals[modelName].chain;
        break;
      case 'txpool':
        model = req.app.locals[modelName];
        break;
    }

    const page = +req.query.page! || 1;
    const limit = +req.query.limit! || model.length;

    let startIndex = (page - 1) * limit;
    let endIndex = page * limit;

    if (reverse) {
      startIndex = model.length - startIndex;
      endIndex = -1 * endIndex;
      [startIndex, endIndex] = [endIndex, startIndex];
    }

    const result: {
      prev?: Page;
      next?: Page;
      data?: Array<object>;
      total: number;
    } = { total: 0 };

    if (startIndex > 1) {
      result.prev = { page: page - 1, limit };
    }

    if (endIndex < model.length) {
      result.next = { page: page + 1, limit };
    }

    result.data = model.slice(startIndex, endIndex);
    result.total = model.length;

    res.locals.result = result;
    next();
  };
}
