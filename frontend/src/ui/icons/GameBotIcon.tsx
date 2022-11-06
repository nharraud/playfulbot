import { SvgIcon } from '@mui/material';
import React from 'react';
import { ReactComponent as Image } from '../../assets/images/noun_Robot_1116654.svg';

export function GameBotIcon(props) {
  return (
    <SvgIcon viewBox="0 0 64 80" {...props}>
      <Image />
    </SvgIcon>
  );
}
