import React, { useEffect } from 'react'
import FacebookButton from './components/facebook_button'
import { Grid, Container, Image } from 'semantic-ui-react'
import AuthService from '../services/auth'

function LoginScreen({ history, openLoadingModal, closeLoadingModal, setPromoter }) {

    useEffect(() => {
        async function checkUser() {
            try {
                openLoadingModal('Loading user')
                const promoter = await AuthService.getPromoter(AuthService.fbid)
                setPromoter(promoter)
                history.push(`/campaigns`)
            } catch (e) {
                console.error(e)
                alert('Please verify that you are authorized to use the app and try again')
                closeLoadingModal()
            }
        }

        if (AuthService.isAuthenticated()) {
            checkUser()
        } else {
            closeLoadingModal()
        }

    }, [AuthService.fbid])

    async function facebookResponse(user) {
        if (!user || user.status === "unknown") {
            return alert('Something wrong happened. Try again!')
        }
        
        try {
            openLoadingModal('Loading user')
            const promoter = await AuthService.getPromoter(user.id)
            setPromoter(promoter)
            history.push(`/campaigns`)
        } catch (e) {
            console.error(e)
            alert('Please verify that you are authorized to use the app and try again')
            closeLoadingModal()
        }
    }

    return (
        <Container>
            <Grid>
                <Grid.Row>
                    <Grid.Column>
                        <Image
                            style={{ marginBottom: '60vh' }}
                            size='medium'
                            centered
                            src='https://atnight.com/images/image-atnight-new-logo.png'
                        />
                    </Grid.Column>
                </Grid.Row>

                <Grid.Row verticalAlign='bottom'>
                    <Grid.Column>
                        <FacebookButton
                            onResponse={facebookResponse}
                        />
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </Container>
    )
}

export default LoginScreen