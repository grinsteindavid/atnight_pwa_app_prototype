import React, { useState, useEffect } from 'react'
import { Container, Card, Image, Icon, Button } from 'semantic-ui-react'
import CampaignService from '../services/campaign'

function ReportScreen({ match, history, openLoadingModal, closeLoadingModal }) {
    const [reportState, setReport] = useState({
        flyer: '',
        rsvp: []
    })

    useEffect(() => {
        async function fetchReport() {
            openLoadingModal('Loading report')
            try {
                const report = await CampaignService.report(match.params.id)
                setReport(report)
            } catch (e) {
                console.error(e)
                alert('Network error')
            }
            closeLoadingModal()
        }

        fetchReport()
    }, [])

    return (
        <>
            <Container style={{ height: '80vh' }}>
                <Card
                    style={{ marginTop: '8vh' }}
                    centered
                >
                    <Image src={reportState.flyer.replace('150x100', '600x400')} wrapped ui={false} />
                    <Card.Content>
                        <Card.Header>{reportState.title}</Card.Header>
                        <Card.Meta>
                            <p className='date'>{reportState.date}</p>
                            <p className='date'>{reportState.start_time} / {reportState.end_time}</p>
                        </Card.Meta>
                        <Card.Description>
                            {reportState.info}
                        </Card.Description>
                    </Card.Content>
                    <Card.Content extra>
                        <Button
                            icon='send'
                            circular
                            floated='left'
                            content={reportState.rsvp.length}
                        />

                        <Button
                            icon='add user'
                            circular
                            floated='right'
                        />
                    </Card.Content>
                </Card>
            </Container>
        </>
    )
}

export default ReportScreen