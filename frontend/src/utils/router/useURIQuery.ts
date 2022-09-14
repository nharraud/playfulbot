import React from 'react';
import { useLocation } from 'react-router-dom';

export function useURIQuery() {
  return new URLSearchParams(useLocation().search);
}
