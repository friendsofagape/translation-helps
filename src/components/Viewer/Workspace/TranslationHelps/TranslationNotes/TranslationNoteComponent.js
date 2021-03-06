import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import {
  Divider,
} from '@material-ui/core';
import {
} from '@material-ui/icons';

import TextComponentWithRCLinks from '../TextComponentWithRCLinks';

export const TranslationNoteComponent = ({
  classes,
  context,
  setContext,
  note,
  addTab,
}) => {
  if (!note) debugger
  const occurrence_note = note.occurrence_note.replace(/\[\[rc:\/\//g, 'http://').replace(/\]\]?/g, '');
  const noteComponent = (
    <TextComponentWithRCLinks
      context={context}
      setContext={setContext}
      text={occurrence_note}
      addTab={addTab}
    />
  );
  return (
    <div className={classes.root}>
      <Divider />
      <div className={classes.note}>
        <strong>{note.gl_quote}</strong> {noteComponent}
      </div>
    </div>
  );
};

TranslationNoteComponent.propTypes = {
  classes: PropTypes.object.isRequired,
  context: PropTypes.object.isRequired,
  setContext: PropTypes.func.isRequired,
  note: PropTypes.object.isRequired,
  addTab: PropTypes.func.isRequired,
};

const styles = theme => ({
  root: {
    width: '100%',
  },
  note: {
    marginTop: '0.5em',
    marginBottom: '0.5em',
  },
});

export default withStyles(styles)(TranslationNoteComponent);
