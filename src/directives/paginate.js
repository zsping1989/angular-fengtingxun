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
            prev_text : '«', //前一页显示
            next_text : '»', //后一页显示
            page_length:2, //页码长度
            fringe:true, //首尾两端
            ajax:true //ajax翻页
        };
        return {
            restrict: 'A', //属性
            //templateUrl : '/bower_components/angular-fengtingxun/src/directives/paginate.html',
            template:'<nav aria-label="Page navigation">'+
            '    <ul class="pagination">'+
            '        <li class="{{firstIsDisabled() ? \'disabled\' : \'\'}}">'+
            '            <a ng-href="{{ pageUrl(data[main_config[\'current_page_key\']]-1) }}" ng-click="setPage(data[main_config[\'current_page_key\']]-1)" aria-label="Previous">'+
            '                <span aria-hidden="true">{{ main_config[\'prev_text\'] }}</span>'+
            '            </a>'+
            '        </li>'+
            '        <li ng-if="main_config[\'fringe\']" ng-show="(data[main_config[\'current_page_key\']] || 1)-main_config[\'page_length\']>1">'+
            '            <a ng-href="{{ pageUrl(1) }}" ng-click="setPage(1)">1</a>'+
            '        </li>'+
            '        <li ng-repeat="value in pageLength" ng-show="(start=data[main_config[\'current_page_key\']]-main_config[\'page_length\'] + value)>0">'+
            '            <a ng-href="{{ pageUrl(start) }}"  ng-click="setPage(start)">{{data[main_config[\'current_page_key\']]-main_config[\'page_length\'] + value}}</a>'+
            '        </li>'+
            '        <li class="active">'+
            '            <a>{{data[main_config[\'current_page_key\']] || 1}}</a>'+
            '        </li>'+
            '        <li ng-repeat="value in pageLength" ng-show="(end=data[main_config[\'current_page_key\']]+value+1)<=(data[main_config[\'last_page_key\']] || lastPage())">'+
            '            <a ng-href="{{ pageUrl(end) }}"  ng-click="setPage(end)">{{data[main_config[\'current_page_key\']]+value+1}}</a>'+
            '        </li>'+
            '        <li ng-if="main_config[\'fringe\']" ng-show="(data[main_config[\'current_page_key\']] || 1)+main_config[\'page_length\']<(data[main_config[\'last_page_key\']] || lastPage())">'+
            '            <a ng-href="{{ pageUrl(data[main_config[\'last_page_key\']] || lastPage()) }}" ng-click="setPage(data[main_config[\'last_page_key\']] || lastPage())">{{data[main_config[\'last_page_key\']] || lastPage()}}</a>'+
            '        </li>'+
            '        <li class="{{lastIsDisabled() ? \'disabled\' : \'\'}}">'+
            '            <a ng-href="{{ pageUrl(data[main_config[\'current_page_key\']]+1) }}"  ng-click="setPage(data[main_config[\'current_page_key\']]+1)" aria-label="Next">'+
            '                <span aria-hidden="true">{{ main_config[\'next_text\'] }}</span>'+
            '            </a>'+
            '        </li>'+
            '    </ul>'+
            '</nav>',
            scope:{data:'='+dataKey,config:'='+configKey,data_url:'='+dataUrlKey},
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
                    var data_url = scope.data_url || window.location.href; //默认当前页面
                    //返回翻页地址
                    return setQueStr(data_url,scope.main_config['page_parameter'],pageNum);
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
                    //当前页码不执行,没有请求地址不跳转
                    if(pageNum == scope.data[scope.main_config['current_page_key']] || !scope.data_url){
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