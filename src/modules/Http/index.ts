import wretch, { type Wretch } from "wretch"

export interface HttpAgentContainer{
    instance: Wretch
}

export const httpAgentContainer: HttpAgentContainer = {
    instance: createInstance()
}

function createInstance(){
    const host = localStorage.getItem('host')
    const port = localStorage.getItem('port')
    const token = localStorage.getItem('token')
    return wretch(`${host}:${[port]}`)
        .auth(`Bearer ${token}`)
        .url('/Administration')
}

export function updateConnection(){
    httpAgentContainer.instance = createInstance()
}
