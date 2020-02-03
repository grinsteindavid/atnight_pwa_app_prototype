import React, { useState, useEffect } from 'react'
import { Route, Switch, Redirect, withRouter } from "react-router-dom"
import AuthService from './services/auth'
import LoginScreen from './screens/login'
import CampaignScreen from './screens/campaigns'
import ReportScreen from './screens/report'
import UserMenu from './components/user_menu'
import { Modal, Loader } from 'semantic-ui-react'

function App({ history }) {
  const [loadingModalState, setLoadingModalState] = useState({
    open: false,
    message: null
  })
  const [promoterState, setPromoterState] = useState(null)
  
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

  useEffect(() => {
    async function getUser() {
      openLoadingModal('Loading user')
      try {
        const promoter = await AuthService.getPromoter(AuthService.fbid)
        setPromoterState(promoter)
        history.push(`/campaigns`)
      } catch (e) {
        console.error(e)
        alert('Please verify that you are authorized to use the app and try again')
      }
      closeLoadingModal()
    }

    if (AuthService.isAuthenticated()) {
      getUser()
    }

  }, [])

  return (
    <>
      <LoadingModal
        open={loadingModalState.open}
        message={loadingModalState.message}
      />
      
      {promoterState && <UserMenu promoter={promoterState} setPromoter={setPromoterState} />}
      
      <Switch>
        <Route exact path="(/login)" render={(props) => {

          return (
            AuthService.isAuthenticated()
              ? <Redirect to='' />
              : <LoginScreen
                  {...props}
                  setPromoter={setPromoterState}
                  openLoadingModal={openLoadingModal}
                  closeLoadingModal={closeLoadingModal}
                />
          )
        }} />
        <Route path="/campaigns" render={(props) => {

          return (
            AuthService.isAuthenticated()
              ? <CampaignScreen {...props} openLoadingModal={openLoadingModal} closeLoadingModal={closeLoadingModal} />
              : <Redirect to='/login' />
          )
        }} />
        <Route path="app/report/:id" render={(props) => {

          return (
            AuthService.isAuthenticated()
              ? <ReportScreen {...props} openLoadingModal={openLoadingModal} closeLoadingModal={closeLoadingModal} />
              : <Redirect to='/login' />
          )
        }} />
        <Route render={(props) => {
          return (
            AuthService.isAuthenticated()
              ? <Redirect to='/campaigns' />
              : <Redirect to='/login' />
          )
        }} />
      </Switch>
    </>
  )
}

function LoadingModal({ open, message }) {

  return (
    <Modal
      basic
      dimmer="inverted"
      open={open}
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

export default withRouter(App)
