import { SvgIcon } from '@material-ui/core';
import React from 'react';
import { ReactComponent as Image } from '../../assets/images/noun_deployment_2583509.svg';

export function DeploymentIcon(props) {
  return (
    <SvgIcon viewBox="0 0 128 160" {...props}>
      <Image />
    </SvgIcon>
  );
}
