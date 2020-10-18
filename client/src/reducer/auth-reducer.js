export const initialState = {
  token: "",
  id: "",
  exp: "",
};

export const reducer = (state, action) => {
  switch (action.type) {
    case "SET_AUTH_TOKEN":
      return {
        ...state,
        token: action.payload.token,
        id: action.payload._id,
        exp: action.payload.exp,
      };
    case "ON_LOGOUT":
      return {
        ...state,
        token: "",
        id: "",
        exp: "",
      };
    default:
      return state;
  }
};
