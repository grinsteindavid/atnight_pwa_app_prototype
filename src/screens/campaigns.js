import React, { useState, useEffect } from 'react'
import { Container, Card, Image, Icon } from 'semantic-ui-react'
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
                        <Image src={campaign.flyer.replace('150x100','600x400')} wrapped ui={false} />
                        <Card.Content>
                            <Card.Header>{campaign.title}</Card.Header>
                            <Card.Meta>
                                <p className='date'>{campaign.date}</p>
                                <p className='date'>{campaign.start_time} / {campaign.end_time}</p>
                            </Card.Meta>
                            <Card.Description>
                                {campaign.info}
                            </Card.Description>
                        </Card.Content>
                        <Card.Content extra>
                            <a>
                                <Icon name='send' />
                                {campaign.rsvp.length}
                            </a>
                        </Card.Content>
                    </Card>
                )
            })}
        </Container>
    )
}

export default CampaignScreen