import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import {
  Modal,
  Paper,
  Chip,
} from '@material-ui/core';

import TextComponentWithRCLinks from './TextComponentWithRCLinks';
import * as helpers from './helpers';

class RCLinkContainer extends React.Component {
  state = {
    languageId: null,
    resourceId: null,
    path: null,
    title: null,
    article: null,
    open: null,
  };

  parseHref(href) {
    let _match, languageId, resourceId, path;
    const regexpLanguageIdResourcePath = /http:\/\/([\w-_]+)\/([\w-_]+)\/(.+)/;
    if (regexpLanguageIdResourcePath.test(href)) {
      const match = regexpLanguageIdResourcePath.exec(href);
      [_match, languageId, resourceId, path] = match;
    } else {
      path = href;
    }
    return {
      languageId: languageId,
      resourceId: resourceId,
      path: path,
    }
  };

  componentWillMount() {
    const {href, children} = this.props;
    let state = this.parseHref(href);
    state.title = children[0];
    this.setState(state);
  };

  componentDidMount() {
    const {languageId, resourceId, path} = this.state;
    if (languageId && resourceId && path) {
      helpers.fetchTitle(languageId, resourceId, path)
      .then(title => {
        this.setState({
          title: title,
        });
      });
    }
  };

  handleOpen = () => {
    const {languageId, resourceId, path} = this.state;
    helpers.fetchArticle(languageId, resourceId, path)
    .then(article => {
      this.setState({
        article: article,
        open: true,
      });
    })
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  render() {
    const {title, path, open, article} = this.state;
    const {classes, href} = this.props;
    return (
      <span>
        <Chip label={title || path} className={classes.chip} onClick={this.handleOpen} />
        <Modal
          aria-labelledby={path}
          aria-describedby={href}
          open={open}
          onClose={this.handleClose}
        >
          <Paper className={classes.paper}>
            <TextComponentWithRCLinks text={article} />
          </Paper>
        </Modal>
      </span>
    );
  }
};

RCLinkContainer.propTypes = {
  classes: PropTypes.object.isRequired,
  url: PropTypes.string.isRequired,
};


const styles = theme => ({
  paper: {
    paddingBottom: theme.spacing.unit,
    paddingLeft: theme.spacing.unit * 2,
    paddingRight: theme.spacing.unit * 2,
    position: 'fixed',
    marginLeft: 'auto',
    marginRight: 'auto',
    maxWidth: '39em',
    top: theme.spacing.unit * 2,
    bottom: theme.spacing.unit * 2,
    left: theme.spacing.unit * 2,
    right: theme.spacing.unit * 2,
    overflow: 'scroll',
  },
  chip: {
    height: 'unset',
  },
});

export default withStyles(styles, { withTheme: true })(RCLinkContainer);