import React from 'react'
import FacebookButton from '../components/facebook_button'
import { Grid, Container, Image } from 'semantic-ui-react'
import AuthService from '../services/auth'

function LoginScreen({ history, openLoadingModal, closeLoadingModal, setPromoter }) {

    async function facebookResponse(user) {
        if (!user || user.status === "unknown") {
            return alert('Something wrong happened. Try again!')
        }
        
        openLoadingModal('Loading user')
        try {
            const promoter = await AuthService.getPromoter(user.id)
            history.push('/campaigns')
            setPromoter(promoter)
        } catch (e) {
            console.error(e)
            alert('Please verify that you are authorized to use the app and try again')
        }
        closeLoadingModal()
    }

    return (
        <Container>
            <Grid>
                <Grid.Row>
                    <Grid.Column>
                        <Image
                            style={{ marginBottom: '60vh', marginTop: '5vh' }}
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