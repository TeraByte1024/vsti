export interface KeyBind {
    key: string,
    pitch: string
}

export interface EnvelopeProps {
    attack:{
        duration: number
    },
    decay:{
        duration: number
    },
    sustain:{
        velocity: number
    },
    release:{
        duration: number
    }
}
