# ldap.api

A minimalistic REST API to query LDAP servers.

There is also a web UI available in a separate repository:

- [`ldap.api`](https://github.com/oyo/ldap.api)
- [`ldap.ui`](https://github.com/oyo/ldap.ui)

### run

First configure the API in
[`config.json`](https://github.com/oyo/ldap.api/blob/main/config.json).
Create a connection string entry for each LDAP server you like to query under "servers".
The syntax is

    "somename": "ldaps://USER:PASSWORD@HOST:PORT/DEFAULT_DN"

Save the file and run

    yarn start [<my-config.json>]

The config file argument is optional in case you choose to save the config as a different file.
Then open the API root in your browser - you should see a list of the available endpoints:

##### Get a list of available endpoints

http://localhost:8001/ldap/api/

    [
        "/ldap/api/",
        "/ldap/api/search",
        "/ldap/api/search/:name",
        "/ldap/api/search/:name/:base",
        "/ldap/api/search/:name/:base/:scope",
        "/ldap/api/search/:name/:base/:scope/:filter",
        "/ldap/api/search/:name/:base/:scope/:filter/:atts"
    ]

##### Get a list of configured LDAP servers

http://localhost:8001/ldap/api/search/

    [
        "/ldap/api/search/somename"
    ]

##### Get the default DN of one configured LDAP server

http://localhost:8001/ldap/api/search/somename

    {
        "params": {
            "base": "dc=example,dc=org",
            "scope": "one",
            "filter": "(objectClass=*)",
            "attributes": [
                "dn"
            ]
        },
        "result": [
            {
                "dn": "o=europe,dc=example,dc=org"
            },
            {
                "dn": "o=asia,dc=example,dc=org"
            },
            {
                "dn": "o=america,dc=example,dc=org"
            }
        ]
    }

##### Perform a subtree search starting from specified base with filter sn=Doe and return attributes mail and phone number

http://localhost:8001/ldap/api/search/somename/o=asia,dc=example,dc=org/sub/sn=Doe/mail,telephoneNumber

    {
        "params": {
            "base": "o=asia,dc=example,dc=org",
            "scope": "sub",
            "filter": "sn=Doe",
            "attributes": [
                "mail",
                "telephoneNumber"
            ]
        },
        "result": [
            {
                "dn": "cn=John+Doe,ou=people,o=asia,dc=example,dc=org",
                "telephoneNumber": "+67-321-987654",
                "mail": "john.doe@example.org"
            },
            ...
        ]
    }

##### Retrieve all attributes of a specified record

http://localhost:8001/ldap/api/search/somename/cn=John+Doe,ou=people,o=asia,dc=example,dc=org/base/_/_/

    {
        "params": {
            "base": "o=asia,dc=example,dc=org",
            "scope": "base",
            "filter": "(objectClass=*)",
            "attributes": []
        },
        "result": [
            {
                "dn": "cn=John+Doe,ou=people,o=asia,dc=example,dc=org",
                "cn": "John Doe",
                "sn": "Doe",
                "givenName": "John",
                "telephoneNumber": "+67-321-987654",
                "mail": "john.doe@example.org",
                ...
            }
        ]
    }
