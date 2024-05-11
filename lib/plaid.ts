// 'use server'
import {Configuration, PlaidApi, PlaidEnvironments} from 'plaid'

// const configuration = new Configuration({
// //     basePath: PlaidEnvironments[PLAID_ENV],
// //     baseOptions: {
// //       headers: {
// //         'PLAID-CLIENT-ID': PLAID_CLIENT_ID,
// //         'PLAID-SECRET': PLAID_SECRET,
// //         'Plaid-Version': '2020-09-14',
// //       },
// //     },
// //   });


const configuration = new Configuration({
    basePath: PlaidEnvironments.sandbox,
    baseOptions: {
        headers: {
            'PLAID-CLIENT-ID': process.env.PLAID_CLIENT_ID,
            'PLAID-SECRET': process.env.PLAID_SECRET
        }
    }
})

export const plaidClient = new PlaidApi(configuration);