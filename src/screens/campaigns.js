import React, { useState, useEffect } from 'react'
import { Container, Card, Image } from 'semantic-ui-react'
import CampaignService from '../services/campaign'

function CampaignScreen({ history, openLoadingModal, closeLoadingModal }) {
    const [campaigns, setCampaigns] = useState([])

    useEffect(() => {
        async function fetchCampaigns() {
            openLoadingModal('Loading campaigns')
            try {
                const campaigns = await CampaignService.list()
                setCampaigns(campaigns)
            } catch (e) {
                console.error(e)
                alert('Network error')
            }
            closeLoadingModal()
        }

        fetchCampaigns()
    }, [])

    return (
        <Container>
            {campaigns.map((campaign, index) => {
                return (
                    <Card
                        fluid
                        key={index}
                    >
                        <Image src='/images/avatar/large/matthew.png' wrapped ui={false} />
                        <Card.Content>
                            <Card.Header>{campaign.name}</Card.Header>
                            <Card.Meta>
                                <span className='date'>Joined in 2015</span>
                            </Card.Meta>
                            <Card.Description>
                                Matthew is a musician living in Nashville.
                            </Card.Description>
                        </Card.Content>
                        <Card.Content extra>
                            <a>
                                <Icon name='user' />
                                22 Friends
                            </a>
                        </Card.Content>
                    </Card>
                )
            })}
        </Container>
    )
}

export default CampaignScreen