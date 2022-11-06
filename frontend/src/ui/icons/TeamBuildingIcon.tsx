import { SvgIcon } from '@mui/material';
import React from 'react';
import { ReactComponent as Image } from '../../assets/images/noun_team building_850702.svg';

export function TeamBuildingIcon(props) {
  return (
    <SvgIcon viewBox="0 0 100 125" {...props}>
      <Image />
    </SvgIcon>
  );
}
