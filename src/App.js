import React, { useState } from 'react'
import { Route, Switch, Redirect } from "react-router-dom"
import AuthService from './services/auth'
import LoginScreen from './screens/login'
import CampaignScreen from './screens/campaign'
import UserMenu from './components/user_menu'
import { Modal, Loader } from 'semantic-ui-react'

function App() {
  [loadingModalState, setLoadingModalState] = useState({
    open: false,
    message: null
  })
  [promoterState, setPromoterState] = useState(null)
  
  function closeLoadingModal() {
    setLoadingModalState({
      open: false,
      message: null
    })
  }

  function openLoadingModal(message = null) {
    setLoadingModalState({
      open: true,
      message
    })
  }

  return (
    <>
      <LoadingModal
        open={loadingModalState.open}
        onClose={closeLoadingModal}
        message={loadingModalState.message}
      />
      
      {promoterState && <UserMenu promoter={promoterState} setPromoter={setPromoterState} />}
      
      <Switch>
        <Route exact path="(/login)" render={(props) => {

          return (
            AuthService.isAuthenticated()
              ? <Redirect to='/' />
              : <LoginScreen
                  {...props}
                  setPromoter={setPromoterState}
                  openLoadingModal={openLoadingModal}
                  closeLoadingModal={closeLoadingModal}
                />
          )
        }} />
        <Route path="/" render={(props) => {

          return (
            AuthService.authenticated()
              ? <CampaignScreen {...props} openLoadingModal={openLoadingModal} closeLoadingModal={closeLoadingModal} />
              : <Redirect to='/login' />
          )
        }} />
        {/* <Route component={NotFoundPage} /> */}
      </Switch>
    </>
  )
}

function LoadingModal({ open, onClose, message }) {

  return (
    <Modal
      basic
      dimmer="inverted"
      open={open}
      // onClose={onClose}
      closeOnEscape={false}
      closeOnDimmerClick={false}
      closeOnTriggerBlur={false}
      closeOnTriggerMouseLeave={false}
      closeOnPortalMouseLeave={false}
      size='small'
    >
      <Modal.Content style={{ textAlign: 'center' }}>
        <Loader inverted>{message || 'Loading'}</Loader>
      </Modal.Content>
    </Modal>
  )
}

export default App
