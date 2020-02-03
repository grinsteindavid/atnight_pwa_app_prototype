export const ENVIRONMENT = process.env.NODE_ENV

export const BASE_URL = ENVIRONMENT === 'production' ? 'http://textblasts.atnight.com/api/promo/' : 'http://textblasts.atnight.com/api/promo/'

export const APP_ID = "1668467996513766"