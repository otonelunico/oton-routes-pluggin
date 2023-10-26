"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = exports.dev = exports.RouterMethods = void 0;
var RouterMethods;
(function (RouterMethods) {
    RouterMethods["POST"] = "post";
    RouterMethods["GET"] = "get";
    RouterMethods["DELETE"] = "delete";
    RouterMethods["PUT"] = "put";
})(RouterMethods = exports.RouterMethods || (exports.RouterMethods = {}));
var urls = global.urls || {};
var routers = [];
var dev = function (flag) {
    if (!flag)
        return;
    var name = 'test.urls';
    (0, exports.register)({
        path: "/test",
        routers: [{
                name: name,
                method: RouterMethods.GET,
                path: '/urls',
                controller: function (req, res) {
                    var data = {};
                    Object.entries(urls).forEach(function (_a) {
                        var key = _a[0], value = _a[1];
                        if (key == name)
                            return;
                        var p = key.split('.')[0];
                        var h = key.split('.')[1];
                        if (!data[p])
                            data[p] = {};
                        if (!h)
                            return data[p] = value;
                        data[p][h] = value;
                    });
                    delete urls[name];
                    return res.status(200).json({
                        success: true,
                        message: "successful",
                        data: data,
                        urls: urls
                    });
                }
            }]
    });
};
exports.dev = dev;
var register = function (routes) {
    routers.push(routes);
};
exports.register = register;
exports.default = (function (app, prefix, stage) {
    routers.forEach(function (r) {
        Object.values(r.routers).forEach(function (e) {
            var _a;
            var path = (prefix + r.path + e.path)
                .replace('//', '/')
                .replace("*", (stage || '*').toLowerCase());
            app[e.method](path, e.controller);
            e.name && (urls[e.name] = {
                path: path,
                method: e.method,
                controller: ((_a = e.controller.toString().split('(')) === null || _a === void 0 ? void 0 : _a[0]) || undefined
            });
        });
    });
    global.urls = urls;
    return;
});
