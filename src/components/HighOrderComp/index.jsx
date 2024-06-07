import React from 'react';
import Cookies from 'js-cookie';
import { Navigate } from 'react-router-dom';

const withTokenCheck = (Component) => {
  class WithTokenCheck extends React.Component {
    render() {
      const token = Cookies.get('jwt_token');
      if (token) {
        // If token is present, redirect to home page
        return <Navigate to="/" />;
      }
      // If token is not present, render the wrapped component
      return <Component {...this.props} />;
    }
  };

  // Set display name for the HOC
  WithTokenCheck.displayName = `WithTokenCheck(${Component.displayName || Component.name})`;

  return WithTokenCheck;
};

export default withTokenCheck;
