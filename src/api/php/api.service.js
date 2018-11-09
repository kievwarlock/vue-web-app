import axios from "axios";
import {ID_TOKEN_KEY, PHP_SERVER_TOKEN} from "@/api/php/jwt.service";
import {PHP_API_URL} from "@/api/config";


const instancePhp = axios.create({
    baseURL: '',
    headers: {
        common:
            {}
    }
});

const ApiPhpService = {

    init() {
        instancePhp.defaults.baseURL = PHP_API_URL;
        this.setToken();
    },
    setToken() {
        instancePhp.defaults.headers.common[ID_TOKEN_KEY] = PHP_SERVER_TOKEN;
    },
    setHeader() {
        //axios.defaults.headers.common[ID_TOKEN_KEY] = PHP_SERVER_TOKEN;
    },
    query(resource, params) {
        return instancePhp.get(resource, params).catch(error => {
            throw new Error(`[PHP] ApiService ${error}`);
        });
    },

    get(resource, slug = "") {
        return instancePhp.get(`${resource}/${slug}`).catch(error => {
            throw new Error(`[PHP] ApiService ${error}`);
        });
    },

    post(resource, params, headers = {} ) {
        return instancePhp.post(`${resource}`, params, headers);
    },

    update(resource, slug, params) {
        return instancePhp.put(`${resource}/${slug}`, params);
    },

    put(resource, params, headers = {} ) {
        return instancePhp.put(`${resource}`, params, headers );
    },
    delete(resource) {
        return instancePhp.delete(resource).catch(error => {
            throw new Error(`[PHP] ApiService ${error}`);
        });
    }
};

export default ApiPhpService;

export const AdminUsersService = {
    get() {
        return ApiPhpService.get("/api/get-users", 10);
    },
    /*getToken(phoneNumber, activationCode) {

        let formData = new FormData();
        formData.append('phoneNumber', phoneNumber);
        formData.append('activationCode', activationCode );

        return ApiPhpService.post("/api/get-token",formData,
        {
           headers:{
               "Content-Type": "multipart/form-data"
           }
        });

    }*/
};


export const AdminMarkerService = {
    get() {
        return ApiPhpService.get("/api/get-points", 1000);
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
                "[PHP] CommentsService.get() article slug required to fetch comments"
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
