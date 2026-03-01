import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import App from './App';
import { BrowserRouter } from 'react-router-dom';

describe('App', () => {
    it('renders without crashing', () => {
        // Just a basic check to ensure tests can run
        render(<App />);
        // Expecting some text to be rendered or just not to throw an error.
        expect(document.body).toBeInTheDocument();
    });
});
