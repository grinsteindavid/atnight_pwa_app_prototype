import React, { useState } from 'react'
import { Menu, Modal, Icon, Image, Label, Button, Header } from 'semantic-ui-react'
import { withRouter } from "react-router-dom"
import AuthService from '../services/auth'

function UserMenu({ history, promoter, setPromoter }) {
    const [showModal, setShowModal] = useState(false)
    
    function openMenuModal() {
        setShowModal(true)
    }

    function closeMenuModal() {
        setShowModal(false)
    }

    function logout() {
        AuthService.logout()
        setPromoter(null)
        history.push(`/`)
    }

    return (
        <>
            <MenuModal
                open={showModal}
                onClose={closeMenuModal}
                promoter={promoter}
                logout={logout}
            />

            <Menu
                icon
                fluid
            >
                <Menu.Item
                    position='right'
                    onClick={openMenuModal}
                >
                    <Icon name='sidebar' />
                </Menu.Item>
            </Menu>
        </>
    )
}

function MenuModal({ open, promoter, onClose, logout }) {

    return (
        <Modal
            basic
            dimmer="inverted"
            open={open}
            size='small'
        >
            <Modal.Content style={{ textAlign: 'center' }}>
                <Menu vertical fluid>
                    <Menu.Item style={{ padding: 0 }}>
                        <div style={{ backgroundImage: `url(${promoter.client.cover})` }}>
                            <Header as='h2' icon>
                                <Image size='big' circular bordered src={promoter.promoter.avatar} />
                                <Header.Subheader>
                                    <p style={{ color: 'white', margin: 0 }}>{promoter.promoter.full_name}</p>
                                </Header.Subheader>
                            </Header>
                        </div>
                    </Menu.Item>
                    <Menu.Item
                        name='inbox'
                    >
                        <strong>Venue</strong> <span style={{ color: 'DeepSkyBlue' }}>{promoter.client.name}</span>
                    </Menu.Item>

                    <Menu.Item
                        name='spam'
                    >
                        <strong>Phone Available</strong>
                        <strong style={{ color: promoter.client.phone_available ? 'green' : 'red' }}>{promoter.client.phone_available ? 'On' : 'Off'}</strong>
                    </Menu.Item>
                    <Menu.Item>
                        <Button.Group fluid>
                            <Button labelPosition='left' icon='close' content='Close' onClick={onClose} />
                            <Button labelPosition='right' icon='sign-out' content='Log Out' onClick={logout} />
                        </Button.Group>
                    </Menu.Item>
                </Menu>
            </Modal.Content>
        </Modal>
    )
}

export default withRouter(UserMenu)