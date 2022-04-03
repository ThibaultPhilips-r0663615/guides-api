export let transportOptions = {
    host: `${process.env.MAIL_HOST}`,
    service: `${process.env.MAIL_SERVICE}`,
    port: `${process.env.MAIL_PORT}`,
    secure: `${process.env.MAIL_SECURE}`, // use TLS
    auth: {
        user: `${process.env.MAIL_AUTH_USER}`,
        pass: `${process.env.MAIL_AUTH_PASSWORD}`
    },
    tls: {
        // do not fail on invalid certs
        rejectUnauthorized: false
    }
}