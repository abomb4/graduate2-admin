import React, { Component } from 'react';
import LoginForm from '../../components/Login/LoginForm';
import { MainLayout, MainHeader, MainMenu, MainFooter } from '../../layouts';
import './LoginPage.css';

class LoginPage extends Component {

  render() {
    return (
      <MainLayout>
        <MainHeader />
        <MainMenu />
        <div className="login-page page-content">
          <LoginForm />
        </div>
        <MainFooter />
      </MainLayout>
    );
  }
}

export default LoginPage;
