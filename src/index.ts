import express, { Request, Response } from 'express'
import { readConfig } from './Config'
import { prepareParams, query, Scope } from './LdapQuery'

const config = readConfig()
const app = express()
const port = config.port ?? 8001

const queryRequest = async (req: Request, res: Response) => {
    const { name, scope, base, filter, atts } = req.params
    const server = config.servers[name]
    if (!server) {
        res.status(404).json({ error: { message: 'LDAP server not found' } })
        return
    }
    const params = prepareParams(
        server,
        !base || base === '_' ? undefined : base,
        !scope || scope === '_' ? undefined : scope as Scope,
        !filter || filter === '_' ? undefined : filter,
        !atts ? ['dn'] : atts === '_' ? undefined : atts.split(',')
    )
    try {
        const result = await query(
            server,
            params
        )
        res.json({ params, result })
    } catch (error) {
        console.log(error)
        res.json({ params, error })
    }
}

app.get(`${config.root}/`, (req: Request, res: Response) =>
    res.json(
        app._router.stack
            .map((r: any) => r.route?.path ?? '')
            .filter((r: string) => r !== '')
    )
)
app.get(`${config.root}/search`, (req: Request, res: Response) =>
    res.json(
        Object.keys(config.servers).map(name => `${config.root}/search/${name}`)
    )
)
app.get(`${config.root}/search/:name`, queryRequest)
app.get(`${config.root}/search/:name/:base`, queryRequest)
app.get(`${config.root}/search/:name/:base/:scope`, queryRequest)
app.get(`${config.root}/search/:name/:base/:scope/:filter`, queryRequest)
app.get(`${config.root}/search/:name/:base/:scope/:filter/:atts`, queryRequest)

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`)
})
