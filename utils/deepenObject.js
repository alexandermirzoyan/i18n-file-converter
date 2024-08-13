const deepenObject = (obj) => {
  const result = {};

  for (const objectPath in obj) {
    const parts = objectPath.split('.');

    let target = result;
    while (parts.length > 1) {
      const part = parts.shift();
      target = target[part] = target[part] || {};
    }

    target[parts[0]] = obj[objectPath]
  }
  
  return result;
}

module.exports = { deepenObject };
