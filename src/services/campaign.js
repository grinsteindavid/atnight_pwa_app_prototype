import axios from 'axios'
import store from 'store'
import { BASE_URL } from '../environment'

class CampaignService {
    constructor() {
        this.http = axios.create({
            baseURL: `${BASE_URL}`
        })

        this.http.interceptors.request.use(
            request => {
                request.headers['fbid'] = store.get('fbid')
                request.headers['X-Authorization'] = store.get('X-Authorization')
                return request
            },
            error => Promise.reject(error)
        )
    }

    async list() {
        const response = await this.http.get('/listCampaigns')
        return response.data
    }

    async report(event) {
        const response = await this.http.get(`/listReport/${event}`)
        return response.data
    }
}

export default new CampaignService()