import React, { useState, useEffect } from 'react'
import { Container, Header, Button, Icon, Segment } from 'semantic-ui-react'
import CampaignService from '../services/campaign'
// import { Link } from "react-router-dom"

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
        <Container style={{ height: '92vh' }}>
            {/* {campaigns.map((campaign, index) => {
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
                            <Link to={`/report/${campaign.id}`}>
                                <Icon name='send' />
                                {campaign.rsvp.length}
                            </Link>
                        </Card.Content>
                    </Card>
                )
            })} */}
            
            <Segment.Group stacked raised style={{ marginTop: '8vh' }}>
                {campaigns.map((campaign, index) => {
                    return(
                        <Segment color='blue' key={index}>
                            <div style={{ height: 30 }}>
                                <Header as='h2' floated='left'>
                                    <Icon name='clipboard' />
                                    <Header.Content>
                                        {campaign.title}
                                        <Header.Subheader>
                                            {campaign.date}
                                        </Header.Subheader>
                                        <Header.Subheader>
                                            {campaign.start_time} / {campaign.end_time}
                                        </Header.Subheader>
                                    </Header.Content>
                                </Header>
                            </div>

                            <div style={{ textAlign: 'right' }}>
                                <Button
                                    circular
                                    size='large'
                                    icon='send'
                                    content={campaign.rsvp.length}
                                    onClick={() => {
                                        history.push(`/report/${campaign.id}`)
                                    }}
                                />
                            </div>
                        </Segment>
                    )
                })}
            </Segment.Group>
        </Container>
    )
}

export default CampaignScreen