/**
 * 所有模块注入
 * Created by zhangshiping on 2017/1/8.
 */
(function(window,angular){'use strict';
    //定义模块名称
    var MODULE_NAME = fengtingxun.getTrueModule('',fengtingxun.config.moduleName);

    //应用模块创建
    var app =  angular.module(MODULE_NAME,fengtingxun.getTrueModules([
        'multilevelMove'
    ]));

})(window,window.angular);