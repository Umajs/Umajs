/**
 * replace tail '//' to '/'
 * replace tail '/home/' to '/home'
 * replace tail '//home' to /home'
 * replace tail '//home//index/' to '/home/index'
 * @param url string
 */
export function replaceTailSlash(url: string) {
    url = url.replace(/\/{2,}/g, '/');

    return url.endsWith('/') ? url.slice(0, -1) : url;
}
