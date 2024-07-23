import { Client } from 'ldapts'
import { LdapConfig } from './Config'

export type Scope = 'base' | 'one' | 'sub'

export type LdapSearchParams = {
    base: string
    scope: Scope
    filter: string
    attributes: string[]
    sizeLimit: number
}

export const prepareParams = (server: LdapConfig, base?: string, scope?: Scope, filter?: string, atts?: string[]): LdapSearchParams => ({
    base: base ?? server.defaultBase,
    scope: scope ?? 'one',
    filter: filter ?? '(objectClass=*)',
    attributes: atts ?? [],
    sizeLimit: 100,
})

export const query = async (server: LdapConfig, params: LdapSearchParams) => {
    const client = new Client({ url: server.url })
    try {
        await client.bind(server.username, server.password)
        const { searchEntries } = await client.search(params.base, params)
        return searchEntries
    } finally {
        await client.unbind()
    }
}

export default { query }