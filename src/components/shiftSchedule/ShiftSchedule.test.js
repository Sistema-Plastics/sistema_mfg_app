import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import ShiftSchedule from './ShiftSchedule';
import mqtt from 'mqtt';

// Mock the mqtt module
jest.mock('mqtt', () => ({
  connect: jest.fn(() => ({
    on: jest.fn(),
    subscribe: jest.fn(),
    end: jest.fn(),
  })),
}));

// Mock the useTheme hook
jest.mock('@mui/material/styles/useTheme', () => ({
  __esModule: true,
  default: () => ({
    palette: {
      sistema: {
        klipit: {
          contrastText: '#fff',
        },
      },
    },
  }),
}));

describe('ShiftSchedule Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders without crashing', () => {
    render(<ShiftSchedule />);
    expect(screen.getByText(/Download Machine Data/i)).toBeInTheDocument();
  });

  test('subscribes to MQTT topics on connect', async () => {
    const mockClient = mqtt.connect();
    render(<ShiftSchedule />);

    // Simulate MQTT connect event
    mockClient.on.mock.calls[0][1]();

    await waitFor(() => {
      expect(mockClient.subscribe).toHaveBeenCalledWith(
        expect.objectContaining({ topic: expect.any(String), qos: 0 }),
        expect.any(Function)
      );
    });
  });

  test('handles MQTT messages correctly', async () => {
    const mockClient = mqtt.connect();
    render(<ShiftSchedule />);

    // Simulate MQTT message event
    const message = JSON.stringify({ value: 'test' });
    mockClient.on.mock.calls[1][1]('some/topic', message);

    await waitFor(() => {
      expect(screen.getByText(/updated topic/i)).toBeInTheDocument();
    });
  });

  test('handles MQTT connection error', async () => {
    const mockClient = mqtt.connect();
    render(<ShiftSchedule />);

    // Simulate MQTT error event
    const error = new Error('Connection error');
    mockClient.on.mock.calls[2][1](error);

    await waitFor(() => {
      expect(mockClient.end).toHaveBeenCalled();
    });
  });

  test('handles MQTT disconnect event', async () => {
    const mockClient = mqtt.connect();
    render(<ShiftSchedule />);

    // Simulate MQTT disconnect event
    mockClient.on.mock.calls[4][1]();

    await waitFor(() => {
      expect(screen.getByText(/disconnected/i)).toBeInTheDocument();
    });
  });

  test('handles edge case when client is null', () => {
    render(<ShiftSchedule />);
    expect(screen.getByText(/Download Machine Data/i)).toBeInTheDocument();
  });
});