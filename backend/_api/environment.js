/* eslint-disable no-undef */

export const dev = {
    label: "dev",
    protocol: "http",
    server_url : "localhost",
    port: "8081",
}

export const test = {
    label: "test",
    protocol: "https",
    server_url: "backend.wordpressshopcart.com.au",
    port : "8081",
}


export const prod = {
    label: "prod",
    protocol: "https",
    server_url: "nvapi.nettverk.io",
    port : null,
}

export let ENVIRONMENT = dev;
if (import.meta.env.VITE_ENV == 'dev') {
    ENVIRONMENT = dev;
} else if (import.meta.env.VITE_ENV == 'test') {
    ENVIRONMENT = test;
} else if (import.meta.env.VITE_ENV == 'prod') {     
    ENVIRONMENT = prod;
}   

