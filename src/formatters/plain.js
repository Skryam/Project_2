import _ from 'lodash';

const plainFormat = (diffObject) => {
  const forStr = (val) => (typeof val === 'string' ? `'${val}'` : val);

  const iter = (obj, prevKey) => {
    const keys = Object.keys(obj);

    const lines = keys.flatMap((key) => {
      if (obj[key].case === 'equal') {
        return [];
      }
      const forPrev = () => (prevKey === undefined ? `${key}` : `${prevKey}.${key}`);

      if (obj[key].case === 'updated') {
        if (!_.isObject(obj[key].previousValue) && !_.isObject(obj[key].newValue)) {
          return `Property '${prevKey}.${key}' was updated. From ${forStr(obj[key].previousValue)} to ${forStr(obj[key].newValue)}`;
        } return `Property '${prevKey}.${key}' was updated. From [complex value] to ${forStr(obj[key].newValue)}`;
      }
      if (obj[key].case === 'nested') {
        return iter(obj[key].value, forPrev());
      }

      // Уникальные из первого
      if (obj[key].case === 'deleted') {
        if (!_.isObject(obj[key].value)) {
          return `Property '${prevKey}.${key}' was removed`;
        } return `Property '${key}' was removed`;
      }

      // Уникальные из второго
      if (obj[key].case === 'added') {
        if (!_.isObject(obj[key].value)) {
          return `Property '${prevKey}.${key}' was added with value: ${forStr(obj[key].value)}`;
        } return `Property '${forPrev()}' was added with value: [complex value]`;
      }
      throw new Error(`Incorrect case: ${obj[key].case}`);
    });
    // console.log(lines)
    return [
      ...lines,
    ].join('\n');
  };

  // console.log(diffObject.common);
  return iter(diffObject);
};

export default plainFormat;
