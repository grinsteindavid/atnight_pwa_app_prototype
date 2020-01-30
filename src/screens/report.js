import React, { useState, useEffect } from 'react'
import { Container, Card, Image, Icon, Button, Modal, Step, Grid, Input, Dropdown, Rating, GridRow, Checkbox } from 'semantic-ui-react'
import CampaignService from '../services/campaign'
import _ from 'lodash'
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
                        report={reportState}
                        onClose={closeRsvpModal}
                        openLoadingModal={openLoadingModal}
                        closeLoadingModal={closeLoadingModal}
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

function RsvpModal({ visible, report, onClose, openLoadingModal, closeLoadingModal }) {
    const [stepIndex, setStepIndex] = useState(0)
    const [ratingState, setRatingState] = useState(7)
    const [genderState, setGenderState] = useState(null)
    const [chargeState, setChargeState] = useState(true)
    const [phoneNumberState, setPhoneNumberState] = useState('')

    function phoneNumberHandler(phone) {
        setPhoneNumberState(phone.match(/\d/g).join(''))
    }

    function stepHandler(e, { index }) {
        setStepIndex(index)
    }

    function onRateHandler(e, { rating }) {
        setRatingState(rating)
    }

    function genderHandler(e, {gender}) {
        setGenderState(gender)
    }

    function chargeHandler(e, { checked }) {
        setChargeState(checked)
    }

    async function sendRsvp() {
        openLoadingModal()

        let data = {
            event_id: report.id,
            client_id: report.client_id,
            phone: phoneNumberState.match(/\d/g).join('')
        }

        if (_.get(report, 'campaign.rating', 0)) {
            data.rating = ratingState
        }
        if (_.get(report, 'campaign.gender', 0)) {
            data.gender = genderState
        }
        if (_.get(report, 'campaign.charge', 0)) {
            data.charge = chargeState
        }

        try {
            const message = await CampaignService.rsvp(data)
            alert(message)
            onClose()
        } catch (e) {
            console.error(e)
            alert(e.message)
        }
        closeLoadingModal()
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
                                {
                                    _.get(report, 'campaign.rating', 0) && (
                                        <Grid.Row>
                                            <Grid.Column>
                                                <Rating
                                                    maxRating={10}
                                                    // defaultRating={7} 
                                                    rating={ratingState}
                                                    icon='star'
                                                    size='massive'
                                                    onRate={onRateHandler}
                                                />
                                            </Grid.Column>
                                        </Grid.Row>
                                    )
                                }

                                {
                                    _.get(report, 'campaign.gender', 0) && (
                                        <Grid.Row>
                                            <Grid.Column>
                                                <Button.Group size='big'>
                                                    <Button
                                                        color='pink'
                                                        gender='female'
                                                        icon={
                                                            <Icon
                                                                color={genderState === 'female' ? 'green' : 'yellow'}
                                                                name={genderState === 'female' ? 'checkmark' : 'female'}
                                                            />
                                                        }
                                                        labelPosition='left'
                                                        content="Girl"
                                                        active={genderState === 'female'}
                                                        onClick={genderHandler}
                                                    />
                                                    <Button.Or />
                                                    <Button
                                                        color='blue'
                                                        gender='male'
                                                        icon={
                                                            <Icon
                                                                color={genderState === 'male' ? 'green' : 'yellow'}
                                                                name={genderState === 'male' ? 'checkmark' : 'male'}
                                                            />
                                                        }
                                                        labelPosition='right'
                                                        content="Guy"
                                                        active={genderState === 'male'}
                                                        onClick={genderHandler}
                                                    />
                                                </Button.Group>
                                            </Grid.Column>
                                        </Grid.Row>
                                    )
                                }

                                {
                                    _.get(report, 'campaign.charge', 0) && (
                                        <Grid.Row>
                                            <Grid.Column>
                                                <Checkbox
                                                    label='Charge?'
                                                    toggle
                                                    checked={chargeState}
                                                    onChange={chargeHandler}
                                                />
                                            </Grid.Column>
                                        </Grid.Row>
                                    )
                                }
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
                                disabled={_.get(report, 'campaign.gender', 0) && !genderState ? true : false}
                                onClick={sendRsvp}
                            />
                        </Button.Group>
                    )
                }
            </Modal.Actions>
        </Modal>
    )
}

export default ReportScreen