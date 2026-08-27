export interface City    { id: string; name: string; active: boolean }
export interface State   { id: string; name: string; active: boolean; cities: City[] }
export interface Country { id: string; name: string; active: boolean; states: State[] }