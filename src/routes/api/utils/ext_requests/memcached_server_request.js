'use server'

export const memcached_server_request = async (method, params, headers) => {
    try {
        const response = await fetch(`${process.env.MEMCACHED_SERVER_DOMAIN}:${process.env.MEMCACHED_SERVER_PORT}/${params}`, {
            method: method,
            ...headers
        })  

        return await response.text()
    } catch (error) {
        console.log(error)
        return {status: 400, ...error}
    }
}