import { CircularProgress, Grid } from '@material-ui/core';
import React from 'react';

export default function LoadingWidget() {
  return (
    <Grid
      container
      spacing={0}
      direction="column"
      alignItems="center"
      justify="center"
      style={{ flex: '1' }}
    >
      <Grid item xs={3}>
        <CircularProgress color="secondary" />
      </Grid>
    </Grid>
  );
}
