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
    directive.paginate = ['$parse', '$animate', '$compile','$http', function($parse, $animate, $compile,$http) {

        var setQueStr = function (url, ref, value) //设置参数值
        {
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

        //数据获取KEY
        var dataKey = fengtingxun.getDirectiveName('paginate');

        //配置数据获取KEY
        var configKey = fengtingxun.getDirectiveName('paginateConfig');

        var dataUrlKey = fengtingxun.getDirectiveName('dataUrl');

        /**
         * 默认配置
         * @type {{}}
         */
        var config = {
            total_key:'total', //数据总条数
            per_page_key:'per_page', //每页数据条数
            current_page_key:'current_page', //当前页码
            page_parameter:'page', //翻页参数
            last_page_key:'last_page', //最后一页
            page_length:2, //页码长度
            fringe:true, //首尾两端
            ajax:true //ajax翻页
        };
        return {
            restrict: 'A', //属性
            templateUrl : '/bower_components/angular-fengtingxun/src/directives/paginate.html',
            scope:{data:'='+dataKey,config:'='+configKey,data_url:'='+dataUrlKey},
            //template:,
            replace:true,
            link: function (scope,element, attr) {
                //现在使用配置
                scope.main_config = fengtingxun.overCinfig(config,scope.config);

                //页码工具条长度
                scope.pageLength = [];
                for (var i=0;i<scope.main_config.page_length;i++){
                    scope.pageLength[i] = i;
                };

                //变量定义
                scope.start = 0;
                scope.end = 0;

                /**
                 * 翻页地址
                 * @param pageNum
                 * @returns {string}
                 */
                scope.pageUrl = function(pageNum){
                    var last_page = scope.lastPage();
                    pageNum = pageNum<1 ? 1 : pageNum; //小于第一页,到第一页
                    pageNum = pageNum>last_page ? last_page : pageNum; //大于最大页码,跳转到最后一页
                    //配置为ajax翻页或是当前页码不跳转
                    if(pageNum == scope.data[scope.main_config['current_page_key']] || scope.main_config['ajax']){
                        return '';
                    }
                    //返回翻页地址
                    return setQueStr(scope.data_url,scope.main_config['page_parameter'],pageNum);
                };

                /**
                 * 跳转到第几页
                 * @param pageNum
                 */
                scope.setPage = function(pageNum){
                    //不是ajax请求不执行
                    if(!scope.main_config['ajax']){
                        return false;
                    }
                    var last_page = scope.lastPage();
                    pageNum = pageNum<1 ? 1 : pageNum; //小于第一页,到第一页
                    pageNum = pageNum>last_page ? last_page : pageNum; //大于最大页码,跳转到最后一页
                    //当前页码不执行
                    if(pageNum == scope.data[scope.main_config['current_page_key']]){
                        return false;
                    }
                    $http({
                        method: 'GET',
                        url: setQueStr(scope.data_url,scope.main_config['page_parameter'],pageNum),
                    }).success(function (data) {
                        if(typeof data=='object'){
                            scope.data = data;
                        }
                    });
                };

                /**
                 * 首页是否禁用
                 * @returns {boolean}
                 */
                scope.firstIsDisabled = function(){
                    return scope.data[scope.main_config['current_page_key']]==1;
                };

                /**
                 * 获取最后一页
                 * @returns {number}
                 */
                scope.lastPage = function(){
                    var total = scope.data[scope.main_config['total_key']];
                    var per_page = scope.data[scope.main_config['per_page_key']];
                    var last_page = typeof scope.data[scope.main_config['last_page_key']]=='undefined' ? Math.ceil(total/per_page) : scope.data[scope.main_config['last_page_key']];
                    return last_page>0 ? last_page : 1;
                };

                /**
                 * 尾页是否禁用
                 * @returns {boolean}
                 */
                scope.lastIsDisabled = function(){
                    var last_page = scope.lastPage(); //最后一页
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