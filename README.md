# ldap.api

A minimalistic REST API to query LDAP servers.

### run

First configure the API in `config.json`.
Create a connection string entry for each LDAP server you like to query under "servers".
The syntax is

    "somename": "ldaps://USER:PASSWORD@HOST:PORT/DEFAULT_DN"

Save the file and run

    yarn start

Then open the API root your browser - you should see a list of the available endpoints:

##### get a list of available endpoints

http://localhost:8000/ldap/

    [
        "/ldap/",
        "/ldap/search",
        "/ldap/search/:name",
        "/ldap/search/:name/:base",
        "/ldap/search/:name/:base/:scope",
        "/ldap/search/:name/:base/:scope/:filter",
        "/ldap/search/:name/:base/:scope/:filter/:atts"
    ]

##### get a list of configured LDAP servers

http://localhost:8000/ldap/search/

    [
        "/ldap/search/somename"
    ]

##### get the default DN of one configured LDAP server

http://localhost:8000/ldap/search/somename

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

##### perform a subtree search starting from specified base with filter sn=Doe and return attributes mail and phone number

http://localhost:8000/ldap/search/somename/o=asia,dc=example,dc=org/sub/sn=Doe/mail,telephoneNumber

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

##### retrieve all attributes of a specified record

http://localhost:8000/ldap/search/somename/cn=John+Doe,ou=people,o=asia,dc=example,dc=org/base/_/_

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

