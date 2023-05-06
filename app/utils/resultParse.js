const parseQuery = query => {
  return JSON.parse(JSON.stringify(query));
};

module.exports = {
  parseQuery,
};
