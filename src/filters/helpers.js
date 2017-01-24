/**
 * Created by zhangshiping on 2017/1/22.
 * 辅助方法过滤器
 */
(function (window, angular) {
    'use strict';
    //定义模块名称
    var MODULE_NAME = 'helpers';

    //辅助方法对象
    var helpers = {};

    /**
     * 字符串截取
     * @param value
     * @param limit
     * @param end
     */
    helpers.strLimit = [function () {
        return function (value, limit, end) {
            limit = limit || 100;
            end = end || '...';
            var _str = value ? String(value) : '';
            if (_str.length > limit) {
                return _str.substring(0, limit) + end;
            }
            return _str;
        };
    }];


    /**
     * 秒钟时间格式
     * @param s
     * @returns {*}
     */
    helpers.secondFormat = [function () {
        return function (s) {
            var t = '';
            if (s > -1) {
                var hour = Math.floor(s / 3600);
                var min = Math.floor(s / 60) % 60;
                var sec = s % 60;
                var day = parseInt(hour / 24);

                if (day > 0) {
                    hour = hour - 24 * day;
                    if (hour < 10) {
                        t = day + "天 0" + hour + ":";
                    } else {
                        t = day + "天 " + hour + ":";
                    }
                } else {
                    if (hour < 10) {
                        t = '0' + hour + ":";
                    } else {
                        t = hour + ":";
                    }
                }
                if (min < 10) {
                    t += "0";
                }
                t += min + ":";
                if (sec < 10) {
                    t += "0";
                }
                t += sec;
            }
            return t;
        }
    }];

    /**
     * 保留几位小数
     * @param num
     * @param leng
     * @returns {string}
     */
    helpers.toFixed = [function () {
        return function (num, leng) {
            num = Number(num) || 0;
            return num.toFixed(leng)
        };
    }];

    /**
     * 返回值层级拼接
     * @param num
     * @returns {*}
     */
    helpers.deep = [function () {
        return function (num) {
            var str = '|';
            for (var i = 1; i < num; ++i) {
                str += '—';
            }
            if (num > 1) {
                return str + ':';
            }
            return '';
        };
    }];


    /**
     * 万用辅助函数
     * @type {*[]}
     */
    helpers.F = [function () {
        return function () {
            var f = eval(arguments[0]);
            arguments.splice = [].splice;
            var p = arguments.splice(1);
            return f.apply(this, p);
        };
    }];

    /**
     * 调用对象自身方法
     * @param obj
     * @param fn
     * @returns {*}
     */
    helpers.call = [function () {
         return function (obj,fn) {
            arguments.splice = [].splice;
            var p = arguments.splice(2);
            return obj[fn].apply(obj, p);
        };
    }];

    //应用模块创建
    var app = angular.module(fengtingxun.getTrueModule('filters.' + MODULE_NAME, fengtingxun.config.moduleName), []);
    angular.forEach(helpers, function (value, key) {
        app.filter(key, value);
    });
})(window, window.angular);