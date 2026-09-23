import React from 'react';
import { describe, it } from 'vitest';
import { render } from '@testing-library/react';
import App from '../App';

describe('Render App Test', () => {
  it('renders App without crashing', () => {
    render(<App />);
  });
});
