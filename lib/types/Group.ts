import {Producer} from "@/lib/types/Producer";

interface Group {
    uuid: string
    name: string
    children: Group[]
    producers: Producer[]
}

export type {Group}