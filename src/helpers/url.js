

function makeGetParameter(pName, pValue) {
  return '&' + pName + '=' + pValue;
}

function makeGetParameterNotNull(pName, pValue) {
  if (!pValue || pValue === null || pValue === '') {
    return '';
  } else {
    return makeGetParameter(pName, pValue);
  }
}


const demandBaseUrl = '/demand';

const urlFunctions = {

  makeQueryParameter: function(param) {
    var result = '?';
    for (const key in param) {
      const value = param[key];
      result += makeGetParameterNotNull(key, value);
    }
    return result;
  },

  queryDemandUrl: function(param) {
    return demandBaseUrl + '/' + this.makeQueryParameter(param);
  }
};

export { urlFunctions } ;
export default urlFunctions;
