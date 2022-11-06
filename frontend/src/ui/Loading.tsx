import { CircularProgress, Grid } from '@mui/material';
import React from 'react';

export default function LoadingWidget() {
  return (
    <Grid
      container
      spacing={0}
      direction="column"
      alignItems="center"
      justifyContent="center"
      style={{ flex: '1' }}
    >
      <Grid item xs={3}>
        <CircularProgress color="secondary" />
      </Grid>
    </Grid>
  );
}
