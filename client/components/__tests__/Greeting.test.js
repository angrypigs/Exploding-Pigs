import React from 'react';
import { render, screen } from '@testing-library/react-native';
import Greeting from '../Greeting';

describe('<Greeting />', () => {
    it('Displays correct greeting with username', () => {
        render(<Greeting name="Marek" />);

        const textElement = screen.getByText('Witaj, Marek!');

        expect(textElement).toBeTruthy();
    });
});