/**-For building url params of features-**/
const buildParam = (name, value, andSign = true) => value ? `${andSign ? "&" : ''}${name}=` + value : ''

export { buildParam }



// The buildParam function is used to construct URL query parameters.It takes three arguments:

// name: The name of the query parameter.
//     value: The value of the query parameter.
//         andSign(optional, default is true): A boolean indicating whether to prepend an & sign to the parameter.
// The function returns a string that represents the query parameter in the format & name=value if andSign is true, or name = value if andSign is false.If the value is falsy(e.g., null, undefined, 0, false, or an empty string), it returns an empty string.