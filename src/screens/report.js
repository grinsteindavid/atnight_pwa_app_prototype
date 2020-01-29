import React, { useState, useEffect } from 'react'
import { Container, Card, Image, Icon, Button, Modal, Step, Grid, Input, Dropdown, Rating, GridRow } from 'semantic-ui-react'
import CampaignService from '../services/campaign'
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/bootstrap.css'

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
    const [phoneNumberState, setPhoneNumberState] = useState('')

    function phoneNumberHandler(phone) {
        setPhoneNumberState(phone.match(/\d/g).join(''))
    }

    function stepHandler(e, { index }) {
        setStepIndex(index)
    }

    return (
        <Modal
            dimmer="inverted"
            open={visible}
            onClose={onClose}
            size='large'
        >
            <Modal.Header>
                <Step.Group attached='top' fluid>
                    <Step
                        index={0}
                        active={stepIndex === 0}
                        completed={phoneNumberState.length === 10}
                        onClick={stepHandler}
                    >
                        <Icon name='phone' />
                        <Step.Content>
                            <Step.Title>Phone number</Step.Title>
                            <Step.Description></Step.Description>
                        </Step.Content>
                    </Step>

                    <Step 
                        index={1}
                        active={stepIndex === 1} 
                        disabled={phoneNumberState.length !== 10}
                        onClick={stepHandler}
                    >
                        <Icon name='user' />
                        <Step.Content>
                            <Step.Title>Guest</Step.Title>
                            <Step.Description>Enter guest information</Step.Description>
                        </Step.Content>
                    </Step>
                </Step.Group>
            </Modal.Header>

            <Modal.Content scrolling>
                {
                    stepIndex === 0 && (
                        <Container textAlign='center'>
                            <PhoneInput
                                inputStyle={{ fontSize: '1.5em' }}
                                dropdownStyle={{ display: 'none' }}
                                inputProps={{
                                    name: 'phone',
                                    required: true,
                                    autoFocus: true
                                }}
                                placeholder='Phone Number'
                                country={'us'}
                                onlyCountries={['us']}
                                disableDropdown={true}
                                value={phoneNumberState}
                                disableCountryCode={true}
                                // countryCodeEditable={false}
                                onChange={phoneNumberHandler}
                            />
                        </Container>
                    )
                }

                {
                    stepIndex === 1 && (
                        <Container textAlign='center'>
                            <Grid padded textAlign='center'>
                                <Grid.Row>
                                    <Grid.Column>
                                        <Rating 
                                            maxRating={10} 
                                            defaultRating={7} 
                                            icon='star'
                                            size='massive'
                                        />
                                    </Grid.Column>
                                </Grid.Row>

                                <Grid.Row>
                                    <Grid.Column>
                                        <Button.Group size='big'>
                                            <Button
                                                color='pink'
                                                icon='female'
                                                labelPosition='left'
                                                content="Girl"
                                                active
                                            />
                                            <Button.Or />
                                            <Button
                                                color='blue'
                                                icon='male'
                                                labelPosition='right'
                                                content="Guy"
                                            />
                                        </Button.Group>
                                    </Grid.Column>
                                </Grid.Row>
                            </Grid>
                        </Container>
                    )
                }
            </Modal.Content>

            <Modal.Actions>
                {
                    stepIndex === 0 && (
                        <Button
                            size='large'
                            icon='close'
                            labelPosition='right'
                            content="Close"
                            onClick={onClose}
                        />
                    )
                }

                {
                    stepIndex === 1 && (
                        <Button.Group size='large'>
                            <Button
                                icon='close'
                                labelPosition='left'
                                content="Close"
                                onClick={onClose}
                            />
                            <Button.Or />
                            <Button
                                color='green'
                                icon='send'
                                labelPosition='right'
                                content="Send"
                            />
                        </Button.Group>
                    )
                }
            </Modal.Actions>
        </Modal>
    )
}

export default ReportScreen