require('dotenv').config({ path: `.env.${process.env.NODE_ENV}` });
console.log(process.env.LOGGING_TYPE);
console.log(process.env.DATABASE_ENV)

const presets = [
    "@babel/preset-env",
    "@babel/preset-typescript"
]

const plugins = [
    ['@babel/plugin-proposal-decorators', { legacy: true }],
    ["@babel/plugin-transform-runtime", {
        regenerator: true
    }],
    ["transform-node-env-inline"],
    ["inline-dotenv"]
]

const env = {
    production: {
        plugins: [["inline-dotenv", {
            path: '.env.production'
        }]]
    },
    development: {
        plugins: [["inline-dotenv", {
            path: '.env.development'
        }]]
    }
}

module.exports = { presets, plugins, env }