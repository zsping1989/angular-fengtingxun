/**
 * Created by zhangshiping on 2017/1/19.
 * 分页功能
 */
(function(window,angular){'use strict';
    //定义模块名称
    var MODULE_NAME = 'paginate';

    //所有定义指令
    var directive = {};

    /**
     * 翻页
     * @type {*[]}
     */
    directive.paginate = ['$parse', '$animate', '$compile', function($parse, $animate, $compile) {
        //数据获取KEY
        var dataKey = fengtingxun.getDirectiveName('paginate');

        //配置数据获取KEY
        var configKey = fengtingxun.getDirectiveName('paginateConfig');

        /**
         * 默认配置
         * @type {{}}
         */
        var config = {
            total_key:'total', //数据总条数
            per_page_key:'per_page', //每页数据条数
            current_page_key:'current_page', //当前页码
            data_url:'', //数据源获取
            page_parameter:'page', //翻页参数
            page_length:3, //页码长度
            ajax:true //ajax翻页
        };

        return {
            restrict: 'A', //属性
            templateUrl : '/bower_components/angular-fengtingxun/src/directives/paginate.html',
            scope:{data:'='+dataKey,config:'='+configKey},
           // template:',
            replace:true,
            link: function (scope,element, attr) {

                //现在使用配置
                scope.main_config = fengtingxun.overCinfig(config,scope.config);

                /**
                 * 首页是否禁用
                 * @returns {boolean}
                 */
                scope.firstIsDisabled = function(){
                    return scope.data[scope.main_config['current_page_key']]==1;
                };

                /**
                 * 尾页是否禁用
                 * @returns {boolean}
                 */
                scope.lastIsDisabled = function(){
                    var total = scope.data[scope.main_config['total_key']]; //总条数
                    var per_page = scope.data[scope.main_config['per_page_key']]; //每页条数
                    var last_page = Math.ceil(total/per_page); //最后一页
                    return last_page==0 || last_page==scope.data[scope.main_config['current_page_key']];
                };
            }
        };

    }];

    //应用模块创建
    var app =  angular.module(fengtingxun.getTrueModule('directive.'+MODULE_NAME,fengtingxun.config.moduleName),[]);

    /**
     * 注册自定义命令
     */
    app.directive(fengtingxun.getTrueDirectives(directive));
})(window,window.angular);