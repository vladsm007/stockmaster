
function bigIntToString(obj) {
  if (typeof obj === 'bigint') {
    return obj.toString();
  }
  if (Array.isArray(obj)) {
    return obj.map(bigIntToString);
  }
  if (obj !== null && typeof obj === 'object') {
    return Object.fromEntries(
      Object.entries(obj).map(([key, value]) => [key, bigIntToString(value)])
    );
  }
  return obj;
}


const bigIntMiddleware = (req, res, next) => {
  const originalJson = res.json;
  res.json = function (data) {
    data = bigIntToString(data);
    originalJson.call(this, data);
  };
  next();
};


module.exports = bigIntMiddleware;