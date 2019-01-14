//export const API_URL = "http://stage-old.gether.work:8010";
//export const PHP_API_URL = "http://dev.usermanager.gether.work";

import ApiService from "./main/api.service";

export const API_URL = "http://stage.gether.work:8010";
export const PHP_API_URL = "http://datamanager.gether.work";


export const urlManager = {
    getAvatarUrl(id, size = 'preview'){
        return `${API_URL}/avatar/${size}/${id}`;
    },
    getImageUrl(id, size = 'preview'){
        return `${API_URL}/image/${size}/${id}`;
    },
    getVideoUrl(id){
        return `${API_URL}/video/${id}`;
    },
    getVideoPreviewUrl(id){
        return `${API_URL}/video/preview/${id}`;
    },
}


export default API_URL;

