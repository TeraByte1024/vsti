import type { Ref } from 'vue';

export interface KeyBind {
    key: string,
    pitch: string
}

export interface EnvelopeProps {
    attack:{duration:Ref<number>,},
    decay:{duration:Ref<number>,},
    sustain:{velocity:Ref<number>,},
    release:{duration:Ref<number>,}
}
