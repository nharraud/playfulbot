import { SvgIcon } from '@material-ui/core';
import React from 'react';
import { ReactComponent as Image } from '../../assets/images/noun_money free_3749255.svg';

export function NoMoneyIcon(props) {
  return (
    <SvgIcon viewBox="0 0 100 125" {...props}>
      <Image/>
    </SvgIcon>
  );
}