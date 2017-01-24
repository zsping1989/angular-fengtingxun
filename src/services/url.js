/**
 * Created by zhangshiping on 2017/1/22.
 * 辅助方法过滤器
 */
(function (window) {
    'use strict';
    //定义模块名称
    var MODULE_NAME = 'url';

    /**
     * url处理服务
     * @type {{}}
     */
    var service = {};

    service.url = function(){
        /**
         * url设置参数
         * @param url
         * @param ref
         * @param value
         * @returns {string}
         */
        this.setQueStr = function (url, ref, value){
            var str = "";
            if (url.indexOf('?') != -1)
                str = url.substr(url.indexOf('?') + 1);
            else
                return url + "?" + ref + "=" + value;
            var returnurl = "";
            var setparam = "";
            var arr;
            var modify = "0";

            if (str.indexOf('&') != -1) {
                arr = str.split('&');

                for (i in arr) {
                    if (arr[i].split('=')[0] == ref) {
                        setparam = value;
                        modify = "1";
                    }
                    else {
                        setparam = arr[i].split('=')[1];
                    }
                    returnurl = returnurl + arr[i].split('=')[0] + "=" + setparam + "&";
                }

                returnurl = returnurl.substr(0, returnurl.length - 1);

                if (modify == "0")
                    if (returnurl == str)
                        returnurl = returnurl + "&" + ref + "=" + value;
            }
            else {
                if (str.indexOf('=') != -1) {
                    arr = str.split('=');

                    if (arr[0] == ref) {
                        setparam = value;
                        modify = "1";
                    }
                    else {
                        setparam = arr[1];
                    }
                    returnurl = arr[0] + "=" + setparam;
                    if (modify == "0")
                        if (returnurl == str)
                            returnurl = returnurl + "&" + ref + "=" + value;
                }
                else
                    returnurl = ref + "=" + value;
            }
            return url.substr(0, url.indexOf('?')) + "?" + returnurl;
        };

        /**
         * 获取路径参数
         * @param key
         * @param url
         * @returns {*}
         */
        this.parseURL = function (key, url) {
            var a = document.createElement('a');
            a.href = url || window.location.href;
            var res = {
                source: url,
                protocol: a.protocol.replace(':', ''),
                host: a.hostname,
                port: a.port,
                query: a.search,
                params: (function () {
                    var ret = {},
                        seg = a.search.replace(/^\?/, '').split('&'),
                        len = seg.length, i = 0, s;
                    for (; i < len; i++) {
                        if (!seg[i]) {
                            continue;
                        }
                        s = seg[i].split('=');
                        ret[s[0]] = s[1];
                    }
                    return ret;
                })(),
                file: (a.pathname.match(/\/([^\/?#]+)$/i) || [, ''])[1],
                hash: a.hash.replace('#', ''),
                path: a.pathname.replace(/^([^\/])/, '/$1'),
                relative: (a.href.match(/tps?:\/\/[^\/]+(.+)/) || [, ''])[1],
                segments: a.pathname.replace(/^\//, '').split('/')
            };
            if (key) {
                return res[key];
            }
            return res;
        }
    };

    var init = function(angular,fengtingxun){
        //应用模块创建
        var app = angular.module(fengtingxun.getTrueModule('services.' + MODULE_NAME, fengtingxun.config.moduleName), []);
        angular.forEach(service,function(value,key){
            app.service(key,value);
        });
    };
    if ( typeof define === "function" && define.amd && typeof requirejs === "function" ) {
        define(['angular','fengtingxun'],function(angular,fengtingxun){
            init(angular,fengtingxun);
        });
    }else {
        init(window.angular,window.fengtingxun);
    }
})(window);