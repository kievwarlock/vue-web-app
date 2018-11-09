import axios from "axios";
import JwtService from "@/api/main/jwt.service";
import {API_URL} from "@/api/config";
import ApiPhpService from "../php/api.service";


const instance = axios.create({
    baseURL: '',
    headers: {
        common:
            {
                //'Content-Type':'text/plain'
            }
    }
});

const ApiService = {


    init() {
        instance.defaults.baseURL = API_URL;
    },
    setHeader() {
        instance.defaults.headers.common[JwtService.ID_TOKEN_KEY] = JwtService.getToken();
    },
    query(resource, params) {
        return instance.get(resource, params).catch(error => {
            throw new Error(`[RWV] ApiService ${error}`);
        });
    },

    get(resource, slug = "", headers ) {
        return instance.get(`${resource}/${slug}`, headers).catch(error => {
            throw new Error(`[RWV] ApiService ${error}`);
        });
    },

    post(resource, params, headers = {} ) {
        return instance.post(`${resource}`, params, headers);
    },

    update(resource, slug, params) {
        return instance.put(`${resource}/${slug}`, params);
    },

    put(resource, params) {
        return instance.put(`${resource}`, params);
    },

    delete(resource) {
        return instance.delete(resource).catch(error => {
            throw new Error(`[RWV] ApiService ${error}`);
        });
    }
};

export default ApiService;


export const UserService = {

    getActivationCode(phoneNumber) {

        return ApiService.post(
            'auth/activation-code',
            phoneNumber,
            {
                headers: {
                    'Content-Type': 'text/plain'
                }
            }
        );

    },
    setAvatar( formData ){
        return ApiService.post(
            'avatar',
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }
        );
    },
    getAvatar( id ){

        return ApiService.get("avatar/preview/" + id ,'', {
            responseType: 'blob',
        });
    },
    getUserProfile( userID ){
        return ApiService.get("profile/" + userID, );
    },
    getToken( data ) {
        return ApiService.post("auth/token", data);
    },

};

/*

export const TagsService = {
    get() {
        return ApiService.get("tags");
    }
};

export const ArticlesService = {
    query(type, params) {
        return ApiService.query("articles" + (type === "feed" ? "/feed" : ""), {
            params: params
        });
    },
    get(slug) {
        return ApiService.get("articles", slug);
    },
    create(params) {
        return ApiService.post("articles", { article: params });
    },
    update(slug, params) {
        return ApiService.update("articles", slug, { article: params });
    },
    destroy(slug) {
        return ApiService.delete(`articles/${slug}`);
    }
};

export const CommentsService = {
    get(slug) {
        if (typeof slug !== "string") {
            throw new Error(
                "[RWV] CommentsService.get() article slug required to fetch comments"
            );
        }
        return ApiService.get("articles", `${slug}/comments`);
    },

    post(slug, payload) {
        return ApiService.post(`articles/${slug}/comments`, {
            comment: { body: payload }
        });
    },

    destroy(slug, commentId) {
        return ApiService.delete(`articles/${slug}/comments/${commentId}`);
    }
};

export const FavoriteService = {
    add(slug) {
        return ApiService.post(`articles/${slug}/favorite`);
    },
    remove(slug) {
        return ApiService.delete(`articles/${slug}/favorite`);
    }
};

*/
