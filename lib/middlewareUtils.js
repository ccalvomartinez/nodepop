//  Util
module.exports.getFilter = function getFilter (req) {
    // Consultamos la query string para obtener los fitros
    const tag = req.query.tag;
    const sale = req.query.sale;
    const name = req.query.name;
    const price = req.query.price;
    const fields = req.query.fields;

    let filter = {};
    if (tag) {
        filter.tag = tag;
    }

    if (sale) {
        if (sale.toLowerCase() === 'true') {
            filter.sale = true;
        } else if (sale.toLowerCase() === 'false') {
            filter.sale = false;
        } else {
            throw new CustomError('Sale filter not valid', 409);
        }
    }
    if (name) {
        filter.name = name;
    }
    if (price) {

        if (price.match(/^\d*-\d*$/g) !== null) {
            const priceFrom = price.match(/^\d*/g);
            const priceUntil = price.match(/\d*$/g);
            if (priceFrom[0]) {
                filter.priceFrom = parseInt(priceFrom[0]);
            }
            if (priceUntil[0]) {
                filter.priceUntil = parseInt(priceUntil[0]);
            }

            if (filter.priceFrom && filter.priceUntil
                && filter.priceFrom > filter.priceUntil) {
                throw new CustomError('Price filter is not valid', 409);
            }
        } else {
            throw new CustomError('Price filter is not valid', 409);
        }
    }
    if (fields) {
            filter.fields = fields.split(',');
    }
    return filter;
}

module.exports.getOptions = function getOptions (req) {
    const start = parseInt(req.query.start);
    const limit = parseInt(req.query.limit);
    const sort = req.query.sort;

    let options = {};
    if (req.query.start) {
        if (start) {
            options.start = start;
        } else {
            throw new CustomError('Start option is not valid', 409);
        }
    }
    if (req.query.limit) {
        if (limit) {
            options.limit = limit;
        } else {
            throw new CustomError('Limit option is not valid', 409);
        }
    }
    if (sort) {
        options.sort = sort;
    }

    return options;
}

module.exports.getUserData = function getUserData (body) {
  const name = body.name;
  const email = body.email;
  const password = body.password;

  if (!name) {
    throw new CustomError('Name cannot be empty', 409);
  }
  if (!email) {
    throw new CustomError('Email cannot be empty', 409);
  }
  if (!password) {
    throw new CustomError('Password cannot be empty', 409);
  }
  return {
    name: name,
    email: email,
    password: password
  };
}

module.exports.getAuthenticationData = function getAuthenticationData (query) {
  const email = query.email;
  const password = query.password;

  if (!email) {
    throw new CustomError('Email cannot be empty', 409);
  }
  if (!password) {
    throw new CustomError('Password cannot be empty', 409);
  }
  return {
    email: email,
    password: password
  };
}