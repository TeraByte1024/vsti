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

export interface ReverbProps {
  duration: number;
  decay: number;
}

export class Vsti {
  audioContext: AudioContext;
  output: Module;

  waveform: OscillatorType = "sine";
  envelope: EnvelopeProps = {
    attack: { duration: 0.1 },
    decay: { duration: 1 },
    sustain: { velocity: 0.4 },
    release: { duration: 0.5 },
  };

  isPlaying: { [index: string]: boolean } = (function () {
    const toReturn: { [index: string]: boolean } = {};
    Object.keys(frequencyMap).forEach((key) => {
      toReturn[key] = false;
    });
    return toReturn;
  })();

  oscModules: { [index: string]: OscillatorModule } = {};

  modules: Module[] = [];

  masterVolume: GainModule;
  reverb: ReverbModule;

  constructor(audioContext: AudioContext) {
    this.audioContext = audioContext;

    const masterVolume = new GainModule(audioContext);
    this.masterVolume = masterVolume;
    this.modules.push(masterVolume);

    const reverbModule = new ReverbModule(audioContext);
    this.reverb = reverbModule;
    this.modules.push(reverbModule);

    reverbModule.connect(masterVolume);
    this.output = masterVolume;
  }

  play(pitch: string) {
    this.audioContext.resume();

    const oscModule = new OscillatorModule(
      this.audioContext,
      this.envelope,
      frequencyMap[pitch],
      this.waveform
    );
    oscModule.connect(this.reverb);

    if (this.isPlaying[pitch] == true) {
      this.oscModules[pitch].delete();
    }
    this.isPlaying[pitch] = true;

    this.oscModules[pitch] = oscModule;
    oscModule.startEnvelope();
  }

  stop(pitch: string) {
    this.isPlaying[pitch] = false;
    this.oscModules[pitch].endEnvelope();
  }
}

abstract class Module {
  audioContext: AudioContext;
  abstract input: AudioNode;
  abstract output: AudioNode;

  constructor(audioContext: AudioContext) {
    this.audioContext = audioContext;
  }

  connect(next: Module) {
    this.output.connect(next.input);
  }

  connectDestination() {
    this.output.connect(this.audioContext.destination);
  }
}

export class OscillatorModule extends Module {
  input: OscillatorNode;
  output: GainNode;

  envelope: EnvelopeProps;

  oscNode: OscillatorNode;
  envelopeGainNode: GainNode;

  constructor(
    audioContext: AudioContext,
    envelope: EnvelopeProps,
    frequency?: number,
    type?: OscillatorType
  ) {
    super(audioContext);
    this.envelope = envelope;
    const oscNode = audioContext.createOscillator();
    oscNode.frequency.value = frequency ?? 440;
    oscNode.type = type ?? "sine";
    this.oscNode = oscNode;
    const envelopeGainNode = audioContext.createGain();
    this.envelopeGainNode = envelopeGainNode;
    oscNode.connect(envelopeGainNode);
    this.input = oscNode;
    this.output = envelopeGainNode;
  }

  setEnvelope(envelope: EnvelopeProps) {
    this.envelope = envelope;
  }

  startEnvelope() {
    const { attack, decay, sustain } = this.envelope;
    const gain = this.envelopeGainNode.gain;
    const currentTime = this.audioContext.currentTime;
    gain.setValueAtTime(0, currentTime);
    const attackEndTime = currentTime + attack.duration;
    gain.linearRampToValueAtTime(1, attackEndTime);
    const decayEndTime = attackEndTime + decay.duration;
    gain.linearRampToValueAtTime(sustain.velocity, decayEndTime);
    this.oscNode.start();
  }

  endEnvelope() {
    const { sustain, release } = this.envelope;
    const gain = this.envelopeGainNode.gain;
    const currentTime = this.audioContext.currentTime;
    gain.cancelScheduledValues(currentTime);
    gain.setValueAtTime(Math.min(gain.value, sustain.velocity), currentTime);
    const releaseEndTime = currentTime + release.duration;
    gain.linearRampToValueAtTime(0, releaseEndTime);
    this.oscNode.stop(releaseEndTime);
  }

  delete() {
    const currentTime = this.audioContext.currentTime;
    this.envelopeGainNode.gain.cancelScheduledValues(currentTime);
    this.oscNode.stop();
  }
}

export class GainModule extends Module {
  input: GainNode;
  output: GainNode;

  gainNode: GainNode;

  constructor(audioContext: AudioContext) {
    super(audioContext);
    const gainNode = audioContext.createGain();
    gainNode.gain.value = 0.3;
    this.gainNode = gainNode;
    this.input = gainNode;
    this.output = gainNode;
  }
}

export class ReverbModule extends Module {
  input: GainNode;
  output: GainNode;

  convolverNode: ConvolverNode;

  duration: number = 2.5;
  decay: number = 5;

  constructor(audioContext: AudioContext, reverb?: ReverbProps) {
    super(audioContext);
    if (reverb) {
      this.duration = reverb.duration;
      this.decay = reverb.decay;
    }
    const convolverNode = audioContext.createConvolver();
    this.convolverNode = convolverNode;
    this.refreshImpulseResponse();

    const inputGainNode = audioContext.createGain();
    const outputGainNode = audioContext.createGain();
    inputGainNode.connect(convolverNode);
    convolverNode.connect(outputGainNode);
    inputGainNode.connect(outputGainNode);
    this.input = inputGainNode;
    this.output = outputGainNode;
  }

  setDuration = (duration: number) => {
    this.duration = duration;
    this.refreshImpulseResponse();
  };

  setDecay = (decay: number) => {
    this.decay = decay;
    this.refreshImpulseResponse();
  };

  refreshImpulseResponse() {
    this.convolverNode.buffer = this.getImpulseResponse(
      this.duration,
      this.decay
    );
  }

  getImpulseResponse(duration: number, decay: number) {
    const length = this.audioContext.sampleRate * duration;
    const impulse = this.audioContext.createBuffer(
      1,
      length,
      this.audioContext.sampleRate
    );
    const IRArray = impulse.getChannelData(0);
    for (let i = 0; i < length; i++)
      IRArray[i] = (2 * Math.random() - 1) * Math.pow(1 - i / length, decay);
    return impulse;
  }

  connect(next: Module) {
    this.output.connect(next.input);
  }

  connectDestination() {
    this.output.connect(this.audioContext.destination);
  }
}

export class AnalyserModule extends Module {
  input: AnalyserNode;
  output: AnalyserNode;

  analyserNode: AnalyserNode;

  bufferLength: number;
  dataArray: Uint8Array;

  constructor(audioContext: AudioContext) {
    super(audioContext);
    const analyserNode = audioContext.createAnalyser();
    analyserNode.fftSize = Math.pow(2, 13);
    this.bufferLength = analyserNode.frequencyBinCount;
    this.dataArray = new Uint8Array(this.bufferLength);
    this.analyserNode = analyserNode;
    this.input = analyserNode;
    this.output = analyserNode;
  }
}

export const wavetable: { label: string; value: any }[] = [
  { label: "Sine", value: "sine" },
  { label: "Square", value: "square" },
  { label: "Saw", value: "sawtooth" },
  { label: "Triangle", value: "triangle" },
  { label: "Custom", value: "custom" },
];

export const frequencyMap: { [index: string]: number } = {
  C0: 16.35,
  "C#0": 17.32,
  D0: 18.35,
  "D#0": 19.45,
  E0: 20.6,
  F0: 21.83,
  "F#0": 23.12,
  G0: 24.5,
  "G#0": 25.96,
  A0: 27.5,
  "A#0": 29.14,
  B0: 30.87,
  C1: 32.7,
  "C#1": 34.65,
  D1: 36.71,
  "D#1": 38.89,
  E1: 41.2,
  F1: 43.65,
  "F#1": 46.25,
  G1: 49,
  "G#1": 51.91,
  A1: 55,
  "A#1": 58.27,
  B1: 61.74,
  C2: 65.41,
  "C#2": 69.3,
  D2: 73.42,
  "D#2": 77.78,
  E2: 82.41,
  F2: 87.31,
  "F#2": 92.5,
  G2: 98,
  "G#2": 103.83,
  A2: 110,
  "A#2": 116.54,
  B2: 123.47,
  C3: 130.81,
  "C#3": 138.59,
  D3: 146.83,
  "D#3": 155.56,
  E3: 164.81,
  F3: 174.61,
  "F#3": 185,
  G3: 196,
  "G#3": 207.65,
  A3: 220,
  "A#3": 233.08,
  B3: 246.94,
  C4: 261.63,
  "C#4": 277.18,
  D4: 293.66,
  "D#4": 311.13,
  E4: 329.63,
  F4: 349.23,
  "F#4": 369.99,
  G4: 392,
  "G#4": 415.3,
  A4: 440,
  "A#4": 466.16,
  B4: 493.88,
  C5: 523.25,
  "C#5": 554.37,
  D5: 587.33,
  "D#5": 622.25,
  E5: 659.26,
  F5: 698.46,
  "F#5": 739.99,
  G5: 783.99,
  "G#5": 830.61,
  A5: 880,
  "A#5": 932.33,
  B5: 987.77,
  C6: 1046.5,
  "C#6": 1108.73,
  D6: 1174.66,
  "D#6": 1244.51,
  E6: 1318.51,
  F6: 1396.91,
  "F#6": 1479.98,
  G6: 1567.99,
  "G#6": 1661.22,
  A6: 1760,
  "A#6": 1864.66,
  B6: 1975.53,
  C7: 2093,
  "C#7": 2217.46,
  D7: 2349.32,
  "D#7": 2489.02,
  E7: 2637.02,
  F7: 2793.83,
  "F#7": 2959.96,
  G7: 3135.96,
  "G#7": 3322.44,
  A7: 3520,
  "A#7": 3729.31,
  B7: 3951.07,
  C8: 4186.01,
  "C#8": 4434.92,
  D8: 4698.64,
  "D#8": 4978.03,
  E8: 5274.04,
  F8: 5587.65,
  "F#8": 5919.91,
  G8: 6271.93,
  "G#8": 6644.88,
  A8: 7040,
  "A#8": 7458.62,
  B8: 7902.13,
};

export const keyBinds: { [index: string]: string } = {
  z: "C3",
  s: "C#3",
  x: "D3",
  d: "D#3",
  c: "E3",
  v: "F3",
  g: "F#3",
  b: "G3",
  h: "G#3",
  n: "A3",
  j: "A#3",
  m: "B3",
  ",": "C4",
  l: "C#4",
  ".": "D4",
  ";": "D#4",
  "/": "E4",
  q: "C4",
  "2": "C#4",
  w: "D4",
  "3": "D#4",
  e: "E4",
  r: "F4",
  "5": "F#4",
  t: "G4",
  "6": "G#4",
  y: "A4",
  "7": "A#4",
  u: "B4",
  i: "C5",
  "9": "C#5",
  o: "D5",
  "0": "D#5",
  p: "E5",
  "[": "F5",
  "=": "F#5",
  "]": "G5",
};
