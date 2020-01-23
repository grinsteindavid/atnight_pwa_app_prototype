import React from 'react'
import FacebookLogin from 'react-facebook-login'
import { Icon } from 'semantic-ui-react'
import { APP_ID } from '../environment'

function FacebookButton({ onResponse }) {

    return (
        <>
            <FacebookLogin
                buttonStyle={{ width: '100%' }}
                appId={APP_ID}
                autoLoad={false}
                fields="name,email,picture"
                callback={onResponse}
                icon={<Icon name='facebook' />}
            />
        </>
    )

}

export default FacebookButton

