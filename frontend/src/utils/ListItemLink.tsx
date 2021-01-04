import React from 'react';
import { Link } from 'react-router-dom';
import ListItem from '@material-ui/core/ListItem';

export default function ListItemLink(props) {
  return <ListItem button component={Link} {...props}/>;
}
