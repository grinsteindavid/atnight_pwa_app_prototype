import React, { useState, useEffect } from 'react'
import { Container, Card, Image, Icon, Button, Modal, Step } from 'semantic-ui-react'
import CampaignService from '../services/campaign'

function ReportScreen({ match, history, openLoadingModal, closeLoadingModal }) {
    const [reportState, setReport] = useState({
        flyer: '',
        rsvp: []
    })
    const [rsvpModal, setRsvpModal] = useState({
        visible: false
    })

    function openRsvpModal() {
        setRsvpModal({
            ...rsvpModal,
            visible: true
        })
    }

    function closeRsvpModal() {
        setRsvpModal({
            ...rsvpModal,
            visible: false
        })
    }

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
            {
                rsvpModal.visible && (
                    <RsvpModal
                        visible={rsvpModal.visible}
                        campaign={reportState.campaign}
                        onClose={closeRsvpModal}
                    />
                )
            }

            <Container style={{ height: '80vh' }}>
                {
                    reportState.id && (
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
                                <Button.Group floated='left'>
                                    <Button labelPosition='left' icon='female' content={reportState.stats.female_count} />
                                    <Button labelPosition='right' icon='male' content={reportState.stats.male_count} />
                                </Button.Group>

                                <Button
                                    icon='add user'
                                    circular
                                    floated='right'
                                    onClick={openRsvpModal}
                                />
                            </Card.Content>
                        </Card>
                    )
                }
            </Container>
        </>
    )
}

function RsvpModal({ visible, campaign, onClose }) {
    const [stepIndex, setStepIndex] = useState(0)

    return (
        <Modal
            dimmer="inverted"
            open={visible}
            onClose={onClose}
            size='large'
        >
            <Modal.Content>
                <Step.Group attached='top' fluid unstackable>
                    <Step active={stepIndex === 0}>
                        <Icon name='phone' />
                        <Step.Content>
                            <Step.Title>Phone number</Step.Title>
                            <Step.Description></Step.Description>
                        </Step.Content>
                    </Step>

                    <Step active={stepIndex === 1}>
                        <Icon name='user' />
                        <Step.Content>
                            <Step.Title>Guest</Step.Title>
                            <Step.Description>Enter guest information</Step.Description>
                        </Step.Content>
                    </Step>
                </Step.Group>


            </Modal.Content>
        </Modal>
    )
}

export default ReportScreen