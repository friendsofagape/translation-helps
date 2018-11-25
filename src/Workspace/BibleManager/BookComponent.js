import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import {
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@material-ui/core';
import {
  Book,
  BookOutlined,
} from '@material-ui/icons';

export const BookComponent = ({classes, bookMetadata, reference, setReference}) =>
  <ListItem
    button
    selected={reference.book === bookMetadata.identifier}
    className={classes.bookListItem}
    style={{
      paddingLeft: '2em',
      paddingRight: '0.7em',
    }}
    onClick={() => {
      setReference({
        book: bookMetadata.identifier,
      });
    }}
  >
    <ListItemIcon className={classes.listItemIcon}>
      {
        (reference.book === bookMetadata.identifier) ?
        <Book fontSize="small" /> :
        <BookOutlined fontSize="small" />
      }
    </ListItemIcon>
    <ListItemText
      className={classes.listItemText}
      primary={bookMetadata.title}
    />
  </ListItem>

BookComponent.propTypes = {
  classes: PropTypes.object.isRequired,
  bookMetadata: PropTypes.object.isRequired,
  reference: PropTypes.object.isRequired,
  setReference: PropTypes.func.isRequired,
}

const styles = theme => ({
  bookListItem: {
  },
  listItemIcon: {
    marginRight: 0,
  },
  listItemText: {
    paddingLeft: '0.7em',
  },
});

export default withStyles(styles, { withTheme: true })(BookComponent);
