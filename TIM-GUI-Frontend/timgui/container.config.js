define({
    defaultApp: 'timgui',
    name: 'Dynamic Activation',
    components: [{
        "path": "flyout"
    }],
    properties: {
        "*": {
            tokenRefreshUrl: "/oauth/v1/refresh",
            sessionRefreshUrl: "/oauth/v1/session",
            authCookieName: "TOKEN"
        }
    }
});
