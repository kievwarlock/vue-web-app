const ID_TOKEN_KEY = "X-Auth-Token";
const ID_USER_KEY = "userId";

export const getToken = () => {
    return window.localStorage.getItem(ID_TOKEN_KEY);
};
export const getUserId = () => {
    return window.localStorage.getItem(ID_USER_KEY);
};

export const saveToken = token => {
    window.localStorage.setItem(ID_TOKEN_KEY, token);
};
export const saveUserId = id => {
    window.localStorage.setItem(ID_USER_KEY, id);
};

export const destroyToken = () => {
    window.localStorage.removeItem(ID_TOKEN_KEY);
};
export const destroyUserId = () => {
    window.localStorage.removeItem(ID_USER_KEY);
};


export default { ID_TOKEN_KEY, getToken, saveToken, destroyToken , getUserId, saveUserId, destroyUserId};