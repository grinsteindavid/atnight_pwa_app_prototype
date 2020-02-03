export const ENVIRONMENT = process.env.NODE_ENV

export const BASE_URL = ENVIRONMENT === 'production' ? 'https://textblasts.atnight.com/api/promo/' : 'https://textblasts.atnight.com/api/promo/'

export const APP_ID = "1668467996513766"