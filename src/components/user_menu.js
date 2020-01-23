import React from 'react'
import { Menu, Modal } from 'semantic-ui-react'
import { Redirect } from "react-router-dom"
import AuthService from '../services/auth'

function UserMenu({ promoter, setPromoter }) {
    
    function logout() {
        AuthService.logout()
        setPromoter(null)
        return <Redirect to="/" />
    }

    return (
        <>
            <MenuModal
                
            />

            <Menu
                icon
                fluid
            >
                <Menu.Item
                    onClick={logout}
                >
                    <Icon name='close' />
                </Menu.Item>
            </Menu>
        </>
    )
}

function MenuModal({ open, onClose, promoter }) {

    return (
        <Modal
            basic
            dimmer="inverted"
            open={open}
            size='small'
        >
            <Modal.Content style={{ textAlign: 'center' }}>
                <Loader inverted>{message || 'Loading'}</Loader>
            </Modal.Content>
        </Modal>
    )
}

export default UserMenu