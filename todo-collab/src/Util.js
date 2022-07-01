require('dotenv').config()

const ApiRoute = (value) => {
    return process.env.REACT_APP_API_URL+value;
}
export {
    ApiRoute
}