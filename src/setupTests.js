// Adds extra matchers
import "@testing-library/jest-dom";

// Mock Tone.js
jest.mock("tone", () => ({
  Destination: {},
  // Mock constructor
  PolySynth: jest.fn().mockImplementation(() => {
    return {
      toDestination: jest.fn(),
    };
  }),
}));
