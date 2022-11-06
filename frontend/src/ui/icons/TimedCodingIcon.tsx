import { SvgIcon } from '@mui/material';
import React from 'react';
import { ReactComponent as Image } from '../../assets/images/noun_Hackathon_6324.svg';

export function TimedCodingIcon(props) {
  return (
    <SvgIcon viewBox="0 0 100 100" {...props}>
      <Image />
    </SvgIcon>
  );
}
