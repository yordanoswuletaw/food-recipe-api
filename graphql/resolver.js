const axios = require("axios").default;
const endpoint = "https://food-recipe-app-et.hasura.app/v1/graphql";
const header = {
  "content-type": "application/json",
  "x-hasura-admin-secret": "fraj0rdn",
};

const CREATE_USER_GQL = `
mutation($username:String!, $email:String!, $password:String!, $refreshToken:String!){
  insert_users_one(object:{username:$username, email:$email, password:$password, refreshToken:$refreshToken}){
    id
    username
    email
  }
}
`;
const GET_USER_GQL = `
query($email:String!){
  users(where:{email:{_eq:$email}}){
    id
    username
    email
    password
  }
}
`;
const SET_REFRESH_TOKEN_GQL = `
mutation($id:uuid!, $refreshToken:String!){
  update_users_by_pk(pk_columns:{id:$id}, _set:{refreshToken:$refreshToken}){
    id
  }
}
`;
const GET_REFRESH_TOKEN_GQL = `
query($refreshToken:String!){
  users(where: {refreshToken: {_eq: $refreshToken}}){
    id
    username
    email
  }
}
`;
const REMOVE_REFRESH_TOKEN_GQL = `
mutation($id:uuid!){
  update_users_by_pk(pk_columns:{id:$id}, _set:{refreshToken:null}){
    refreshToken
    id
  }
}
`;

const resolve = async (variables, operation) => {
  const graphqlQuery = {
    query: operation,
    variables: variables,
  };
  while (true) {
    try {
      fetchResponse = await axios({
        url: endpoint,
        headers: header,
        method: "post",
        data: graphqlQuery,
      })
        .then((result) => result.data)
        .catch((error) => {});
      if (fetchResponse) {
        return fetchResponse;
      }
    } catch (error) {}
  }
};

module.exports = {
  CREATE_USER_GQL,
  GET_USER_GQL,
  SET_REFRESH_TOKEN_GQL,
  GET_REFRESH_TOKEN_GQL,
  REMOVE_REFRESH_TOKEN_GQL,
  resolve,
};
