const db = require('../database/connection')

module.exports.ping = (req, res) => {
    const {name, nick} = req.body
    console.log(`name: ${name}`)
    console.log(`password: ${nick}`)
    try {
        res.send("Pong")
    } catch(err) {
        console.log(err);
    }
}

module.exports.getAllUsers = (req, res) => {
    db
        .query(`select * from user_data`)
        .then(result => {res.send(result.rows)
            console.log('get all users')
        })
        .catch( err => console.error(err.stack))
    db.end
}

module.exports.signup_post = async (req, res) => {
    const {username, password} = req.body
    await db
        .query(`insert into user_data(username, password) values('${username}','${password}')`)
        .then(
            res.status(201).send('User added'),
            console.log(`New user added: ${JSON.stringify(req.body)}`))
        .catch(err =>
            res.send(err) &&
            console.error(err)
            )
    // db.end()
}

module.exports.getUserById = (req, res) => {
    console.log(`user id: ${req.params.id}`);
    console.log(`get user by id`);
    console.log(`user id err: ${err}`);
    console.log(`user id res: ${result}`);
    db.query(`select * from user_data where id = ${req.params.id}`, (err, result) => {
        if (!err) {
            res.send(result.rows)
        } else {
            console.error(err);
        }
    })
    db.end
}

module.exports.login_get = (req, res) => {
    console.log(`user id: ${req.params.name}`);
    console.log(`user name: ${req.params.name}`);
    console.log(`user pass: ${req.params.password}`);
    try {
        db.query(`  select count(*)
                    from user_data
                    where username = ${req.params.name}
                    and password = ${req.params.password}`,
            (err, result) => {
                console.log(`get user by id`);
                console.log(`user id err: ${err}`);
                console.log(`user id res: ${result}`);
                if (!err) {
                    res.send(result.rows)
                } else {
                    console.error(err);
                }
            })
        db.end
    } catch (err) {
        console.error(err)
    }
}