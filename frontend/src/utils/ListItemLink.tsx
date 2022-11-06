import React from 'react';
import { Link } from 'react-router-dom';
import ListItem from '@mui/material/ListItem';

export default function ListItemLink(props) {
  return <ListItem button component={Link} {...props} />;
}
