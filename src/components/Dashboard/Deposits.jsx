import * as React from 'react';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import Title from './Title.jsx';

function preventDefault(event) {
  event.preventDefault();
}

export default function Deposits() {
  return (
    <React.Fragment>
      <Title>Current Net Liquidation Value</Title>
      <Typography component="p" variant="h4">
        $113,766.00
      </Typography>
      <Typography color="text.secondary" sx={{ flex: 1 }}>
        {Date()}
      </Typography>
      <div>
        <Link color="primary" href="#" onClick={preventDefault}>
          View balance
        </Link>
      </div>
    </React.Fragment>
  );
}