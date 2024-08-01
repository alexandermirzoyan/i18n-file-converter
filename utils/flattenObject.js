const flattenObject = (obj, parentKey = '', res = {}) => {
  for (let key in obj) {
    const propName = parentKey ? `${parentKey}.${key}` : key;
    if (typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
      flattenObject(obj[key], propName, res);
    } else {
      res[propName] = obj[key];
    }
  }
  return res;
};

module.exports = { flattenObject };
