import React from 'react';

import Button from '@material-ui/core/Button';
import copy from 'copy-to-clipboard';

type PropsType = {
  text: string;
  children: any;
  format?: string;
};

export default function CopyToClipboardButton({
  text,
  children,
  format = 'text/plain',
}: PropsType) {
  return (
    <Button variant="contained" size="small" color="primary" onClick={() => copy(text, { format })}>
      {children}
    </Button>
  );
}
