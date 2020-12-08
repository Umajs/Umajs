/**
 * replace tail '/'
 * @param url string
 */
export function replaceTailSlash(url: string) {
    return url.endsWith('/') ? url.slice(0, -1) : url;
}
