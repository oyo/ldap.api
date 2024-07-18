import { readFileSync } from 'fs'
import Pattern from './Pattern'

const defaultConfigFile = 'config.json'

export type Connstring = string

export type LdapConfig = {
    url: string
    username: string
    password: string
    defaultBase: string
}

export type Config = {
    port: number
    root: string
    servers: Record<string, LdapConfig>
}

export type ConfigRaw = {
    port: number
    root: string
    servers: Record<string, Connstring>
}

const connstringToLdapConfig = (connstring: Connstring): LdapConfig => {
    const [protocol, credentials, host, defaultBase] = connstring.split(/[\/@]+/)
    const [username, password] = credentials.split(':')
    const url = `${protocol}//${host}`
    return { url, username, password, defaultBase }
}

export const readConfig = (): Config => {
    const raw = JSON.parse(readFileSync(process.argv[2] ?? defaultConfigFile, 'utf8')) as ConfigRaw
    const servers = Object.fromEntries(
        Object.entries(raw.servers).map(([name, connstring]) => [name, connstringToLdapConfig(connstring)])
    )
    return { ...raw, servers }
}
