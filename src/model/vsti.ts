export interface KeyBind {
  key: string;
  pitch: string;
}

export interface EnvelopeProps {
  attack: {
    duration: number;
  };
  decay: {
    duration: number;
  };
  sustain: {
    velocity: number;
  };
  release: {
    duration: number;
  };
}

export const frequencyMap: { [index: string]: number } = {
  C3: 130.81,
  "C#3": 138.59,
  D3: 146.83,
  "D#3": 155.56,
  E3: 164.81,
  F3: 174.61,
  "F#3": 185.0,
  G3: 196.0,
  "G#3": 207.65,
  A3: 220.0,
  "A#3": 233.08,
  B3: 246.94,
  C4: 261.63,
  "C#4": 277.18,
  D4: 293.66,
  "D#4": 311.13,
  E4: 329.63,
  F4: 349.23,
  "F#4": 369.99,
  G4: 392.0,
  "G#4": 415.3,
  A4: 440.0,
  "A#4": 466.16,
  B4: 493.88,
  C5: 523.25,
  "C#5": 554.37,
  D5: 587.33,
  "D#5": 622.25,
  E5: 659.25,
  F5: 698.46,
  "F#5": 739.99,
  G5: 783.99,
  "G#5": 830.61,
  A5: 880.0,
  "A#5": 932.33,
  B5: 987.77,
  C6: 1046.5,
};

export const keyBinds: KeyBind[] = [
  { key: "z", pitch: "C3" },
  { key: "s", pitch: "C#3" },
  { key: "x", pitch: "D3" },
  { key: "d", pitch: "D#3" },
  { key: "c", pitch: "E3" },
  { key: "v", pitch: "F3" },
  { key: "g", pitch: "F#3" },
  { key: "b", pitch: "G3" },
  { key: "h", pitch: "G#3" },
  { key: "n", pitch: "A3" },
  { key: "j", pitch: "A#3" },
  { key: "m", pitch: "B3" },
  { key: ",", pitch: "C4" },
  { key: "l", pitch: "C#4" },
  { key: ".", pitch: "D4" },
  { key: ";", pitch: "D#4" },
  { key: "/", pitch: "E4" },

  { key: "q", pitch: "C4" },
  { key: "2", pitch: "C#4" },
  { key: "w", pitch: "D4" },
  { key: "3", pitch: "D#4" },
  { key: "e", pitch: "E4" },
  { key: "r", pitch: "F4" },
  { key: "5", pitch: "F#4" },
  { key: "t", pitch: "G4" },
  { key: "6", pitch: "G#4" },
  { key: "y", pitch: "A4" },
  { key: "7", pitch: "A#4" },
  { key: "u", pitch: "B4" },
  { key: "i", pitch: "C5" },
  { key: "9", pitch: "C#5" },
  { key: "o", pitch: "D5" },
  { key: "0", pitch: "D#5" },
  { key: "p", pitch: "E5" },
  { key: "[", pitch: "F5" },
  { key: "=", pitch: "F#5" },
  { key: "]", pitch: "G5" },
];
