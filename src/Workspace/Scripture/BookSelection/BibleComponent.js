import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import {
  Paper,
  List,
} from '@material-ui/core';

import TestamentContainer from './TestamentContainer';

export const BibleComponent = ({classes, manifests, context, setContext}) => {
  let bible = {};
  const {ult} = manifests;
  if (ult) {
    ult.projects.forEach(project => {
      const testamentId = project.categories.includes('bible-ot') ? 'Old Testament': 'New Testament';
      if (!bible[testamentId]) bible[testamentId] = [];
      bible[testamentId].push(project);
    });
  }
  return (
    <Paper className={classes.bible}>
      <List
        className={classes.bible}
        component="nav"
        dense
      >
        <div className={classes.bibleList}>
          {
            Object.keys(bible).map(testamentId =>
              <TestamentContainer
                key={testamentId}
                testamentId={testamentId}
                books={bible[testamentId]}
                context={context}
                setContext={setContext}
              />
            )
          }
        </div>
      </List>
    </Paper>
    )
}

BibleComponent.propTypes = {
  classes: PropTypes.object.isRequired,
  manifests: PropTypes.object.isRequired,
  context: PropTypes.object.isRequired,
  setContext: PropTypes.func.isRequired,
};

const styles = theme => ({
  bible: {
    height: '100%',
    maxWidth: '40em',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  bibleList: {
    height: '100%',
    overflowY: 'auto',
  },
});

export default withStyles(styles)(BibleComponent);