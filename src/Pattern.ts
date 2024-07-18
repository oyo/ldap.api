const DN_ATT = '[a-zA-Z0-9-_]{1,10}'
const DN_VAL = '[a-zA-Z0-9-_ ]{1,100}'
const DN_LVL = `${DN_ATT}=${DN_VAL}`
const DN = `${DN_LVL}(,${DN_LVL}){0,20}`

const Pattern = {
    DN: new RegExp(`^${DN}$`),
}

export default Pattern