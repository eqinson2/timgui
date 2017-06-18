/**
 * @author esaejon & esamalb
 *
 * This widget contains the auth-headers
 */
define([
    "jscore/core",
    "container/api"
], function (core, container) {
    return core.Widget.extend({
        authenticationDetails: function () {
            return {
                cookieName: container.getConfig().properties["*"].authCookieName,
                tokenRefreshUrl: container.getConfig().properties["*"].tokenRefreshUrl,
                sessionRefreshUrl: container.getConfig().properties["*"].sessionRefreshUrl
            };
        }
    });
});