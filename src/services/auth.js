import axios from 'axios'
import store from 'store'
import { BASE_URL, ENVIRONMENT } from '../environment'

class AuthService {
    constructor() {
        // if (ENVIRONMENT !== 'production') {
        //     store.remove('fbid')
        //     store.remove('X-Authorization')
        // }
        this.fbid = store.get('fbid')
        this.http = axios.create({
            baseURL: `${BASE_URL}`
        })
        this.http.defaults.headers.common['fbid'] = this.fbid
    }

    isAuthenticated() {
        return this.fbid && this.fbid.length
    }

    logout() {
        store.remove('fbid')
        store.remove('X-Authorization')
        this.fbid = null
    }
    
    async getPromoter(fbid) {
        this.http.defaults.headers.common['fbid'] = fbid
        const response = await this.http.get('/loginPromoter')
        this.http.defaults.headers.common['X-Authorization'] = response.data.AppToken
        this.fbid = fbid
        store.set('fbid', fbid)
        store.set('X-Authorization', response.data.AppToken)
        // store.set('promoterName', dude.name)
        // console.log(`Good to see you, ${user.name}.`)
        // console.log(user.id)
        // console.log(store.get('fbid'))
        // console.log(HTTP.defaults.headers)
        // console.log(response.data)
        // console.log(store.get('X-Authorization'))
        // this.$router.push({ name: 'campaings' })
        return response.data
    }
}

export default new AuthService()