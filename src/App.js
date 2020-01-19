import React from 'react';
import './App.css';
import store from 'store';
import axios from 'axios';

const HTTP = axios.create({
  baseURL: `https://atnight.com/api/v1/tb/`
})

window.fbAsyncInit = function () {
  FB.init({
    appId: '1668467996513766',
    cookie: true,  // enable cookies to allow the server to access the session
    xfbml: true,  // parse social plugins on this page
    version: 'v2.8' // use graph api version 2.8
  })
};
(function (d, s, id) {
  var js, fjs = d.getElementsByTagName(s)[0];
  if (d.getElementById(id)) return;
  js = d.createElement(s); js.id = id;
  js.src = '//connect.facebook.net/en_US/sdk.js';
  fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));

function App() {
  return (
    <div className="App">
      <FacebookButton />
    </div>
  );
}

function FacebookButton() {

  const fbSignInParams = {
    scope: 'email,user_likes',
    return_scopes: true
  }

  function onSignInSuccess() {
    FB.api('/me', dude => {
      console.log(`Good to see you, ${dude.name}.`)
      store.set('promoterName', dude.name)
      console.log(dude.id)
      store.set('fbid', dude.id)
      console.log(store.get('fbid'))
      HTTP.defaults.headers.common['fbid'] = store.get('fbid');
      getPromoter()
    })
  }

  function onSignInError(error) {
    console.log('OH NOES', error)
    // this.$swal('OH NO', 'Your account is not authorized', 'error')
  }

  async function getPromoter() {
    try {
      const response = await HTTP.get('/loginPromoter')
      console.log(HTTP.defaults.headers)
      console.log(response.data);
      store.set('X-Authorization', response.data.AppToken)
      console.log(store.get('X-Authorization'))
      HTTP.defaults.headers.common['X-Authorization'] = store.get('X-Authorization');
      // this.$router.push({ name: 'campaings' })
    } catch (e) {
      console.log(HTTP.defaults.headers)
      console.log(error);
      // this.$swal('You are not authorized', 'Please verify that you are authorized to use the app and try again', 'error')
    }
  }

}

export default App;
