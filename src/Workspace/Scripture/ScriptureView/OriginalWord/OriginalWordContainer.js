import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import OriginalWordComponent from './OriginalWordComponent';
import * as helpers from './helpers';

class OriginalWordContainer extends React.Component {
  state = {
    senses: [],
  };

  componentDidMount() {
    helpers.senses(this.props.verseObject.strong)
    .then(senses => {
      if (!this.unmounted) {
        this.setState({
          senses: senses,
        });
      }
    }).catch(error => {
      console.log(error);
    });
  };

  componentWillUnmount() {
    this.unmounted = true;
  }

  render() {
    return (
      <OriginalWordComponent
        verseObject={this.props.verseObject}
        senses={this.state.senses}
      />
    );
  };
};

OriginalWordContainer.propTypes = {
  classes: PropTypes.object.isRequired,
  verseObject: PropTypes.object.isRequired,
};

const styles = theme => ({
});

export default withStyles(styles, { withTheme: true })(OriginalWordContainer);
