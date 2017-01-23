/**
 * 所有模块注入
 * Created by zhangshiping on 2017/1/8.
 */
(function(window,angular){'use strict';
    //定义模块名称
    var MODULE_NAME = fengtingxun.getTrueModule('',fengtingxun.config.moduleName);

    //应用模块创建
    var app =  angular.module(MODULE_NAME,fengtingxun.getTrueModules([
        'services.tree', //树状服务
        'services.url', //url服务
        'directives.multilevelMove', //多级联动
        'directives.paginate', //分页
        'filters.helpers' //辅助方法
    ]));

})(window,window.angular);