import axios from 'axios'
import store from 'store'
import { BASE_URL, ENVIRONMENT } from '../environment'

class Auth {
    constructor() {
        if (ENVIRONMENT !== 'production') {
            store.remove('fbid')
            store.remove('X-Authorization')
        }
        this.fbid = Store.get('fbid')
        this.http = axios.create({
            baseURL: `${BASE_URL}`
        })
        this.http.defaults.headers.common['fbid'] = this.fbid
    }

    isAuthenticated() {
        return this.fbid && this.fbid.length
    }

    logout() {
        Store.remove('fbid')
        this.fbid = null
    }
    
    async getPromoter(fbid) {
        this.http.defaults.headers.common['fbid'] = fbid

        try {
            const response = await this.http.get('/loginPromoter')
            this.http.defaults.headers.common['X-Authorization'] = response.data.AppToken
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
        } catch (e) {
            console.error(this.http.defaults.headers)
            console.error(e.message)
            alert('Please verify that you are authorized to use the app and try again')
        }
    }
}

export default new Auth()