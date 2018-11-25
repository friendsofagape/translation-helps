import React from 'react';
import ApplicationBar from './ApplicationBar';

const projectName = 'translationHelps';

class ApplicationBarContainer extends React.Component {
  state = {
  };

  render() {
    const {props} = this;
    return (
      <ApplicationBar
        {...props}
        projectName={projectName}
      />
    );
  };
}
export default ApplicationBarContainer;
