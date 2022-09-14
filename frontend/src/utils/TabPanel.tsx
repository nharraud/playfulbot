import React from 'react';

export interface TabPanelProps<T> {
  children: React.ReactNode;
  value: T;
  index: T;
}

export function TabPanel<T>(props: TabPanelProps<T>) {
  const { children, value, index, ...other } = props;

  return (
    <div role="tabpanel" hidden={value !== index} {...other}>
      {value === index && props.children}
    </div>
  );
}
