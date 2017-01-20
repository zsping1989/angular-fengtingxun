/**
 * Created by zhangshiping on 2017/1/18.
 */
/**
 * 框架配置
 * @type {{config: {moduleName: string, directivePrefix: string}}}
 */

var fengtingxun = {
    config: {
        moduleName: 'FengTingXun', //模块名称
        directivePrefix: 'ftx' //指令前缀
    }
};

/**
 * 获取模块名称
 * @param name
 * @param prefix
 * @returns {string}
 */
fengtingxun.getTrueModule = function (name, prefix) {
    prefix = prefix.replace(/(\w)/,function(v){return v.toUpperCase()}) || 'FengTingXun';
    return name ? 'ng' + prefix + '.' + name : 'ng' + prefix;
};

/**
 *
 * @param modules
 * @returns {Array}
 */
fengtingxun.getTrueModules = function (modules) {
    var result = [];
    for (var i in modules) {
        result[i] = fengtingxun.getTrueModule(modules[i], fengtingxun.config.moduleName);
    }
    return result;
};

/**
 *
 * @param old_config
 * @param config
 * @returns {*}
 */
fengtingxun.overCinfig = function (old_config, config) {
    var result = {};
    if (!config) {
        return old_config;
    }
    for (var i in old_config) {
        if (typeof config[i] != 'undefined') {
            result[i] = config[i];
        } else {
            result[i] = old_config[i];
        }
    }
    return result;
};

/**
 * 命令名称获取
 * @param name
 * @returns {*}
 */
fengtingxun.getDirectiveName = function(name){
    var directivePrefix = fengtingxun['config']['directivePrefix'] || 'ftx';
    return directivePrefix+name.replace(/(\w)/,function(v){return v.toUpperCase()});
};

/**
 * 获取带有前缀的指令
 * @param directives
 * @returns {{}}
 */
fengtingxun.getTrueDirectives = function(directives){
    var result = {};
    for(var key in directives){
        result[fengtingxun.getDirectiveName(key)] = directives[key];
    }
    return result;
};
/**
 * 所有模块注入
 * Created by zhangshiping on 2017/1/8.
 */
(function(window,angular){'use strict';
    //定义模块名称
    var MODULE_NAME = fengtingxun.getTrueModule('',fengtingxun.config.moduleName);

    //应用模块创建
    var app =  angular.module(MODULE_NAME,fengtingxun.getTrueModules([
        'directive.multilevelMove', //多级联动
        'directive.paginate' //分页
    ]));

})(window,window.angular);
/**
 * Created by zhangshiping on 2017/1/8.
 */
(function(window,angular){'use strict';
    //定义模块名称
    var MODULE_NAME = 'multilevelMove';

    //所有定义指令
    var directive = {};

    /**
     * 多级联动
     * @type {*[]}
     */
    directive.multilevelMove = ['$parse', '$animate', '$compile', function($parse, $animate, $compile) {

        //默认配置
        var config = {
            show : 'name', //多级联动显示字段
            value : 'id', //多级联动显示值
            childrens_key : 'childrens', //子节点字段键
            element_name : '', //表单节点名称,用于非ajax表单提交数据
            label : [], //每一个下拉菜单的左侧说明
            empty : [], //当没有选择值时的提示
            margin_tree : false, //是否为数据库表结构数据
            primary_key : 'id', //主键
            parent_key : 'parent_id', //父级字段
            selected : false //是否默认选中第一个值
        };

        //数据获取KEY
        var dataKey = fengtingxun.getDirectiveName('multilevelMove');

        //配置数据获取KEY
        var configKey = fengtingxun.getDirectiveName('multilevelMoveConfig');

        /**
         * 将数据某一列作key
         * @param datas 需要处理的数据
         * @param key 主键,唯一标示
         * @param childrens_key 子节点的键
         * @param prefix 键前缀
         * @returns {{}}
         */
        var keyBy = function (datas,key,childrens_key,prefix){
            prefix = prefix || 'id_';
            prefix = prefix+'';//字符串类型
            childrens_key = typeof childrens_key=="undefined" ? '' : childrens_key;
            var result = {},item;
            for (var i in datas){
                item = datas[i];
                if(typeof item[childrens_key]=="object" && item[childrens_key].length && childrens_key !=='' ){
                    item[childrens_key]=keyBy(item[childrens_key],key,childrens_key,prefix);
                }
                result[prefix+item[key]] = item;
            }

            return result;
        };

        /**
         * json格式转树状结构
         * @param   {json}      json数据
         * @param   {String}    id的字符串
         * @param   {String}    父id的字符串
         * @param   {String}    children的字符串
         * @return  {Array}     数组
         */
        var toTree = function (a, idStr, pidStr, chindrenStr){
            var r = [], hash = {}, id = idStr, pid = pidStr, children = chindrenStr, i = 0, j = 0, len = a.length;
            for(; i < len; i++){
                hash[a[i][id]] = a[i];
            }
            for(; j < len; j++){
                var aVal = a[j], hashVP = hash[aVal[pid]];
                if(hashVP){
                    !hashVP[children] && (hashVP[children] = []);
                    hashVP[children].push(aVal);
                }else{
                    r.push(aVal);
                }
            }
            return r;
        };

        var treeFirst = function(datas,value_key,chindrens_key,result){
            //定义结果
            if(typeof result == 'undefined'){
                var result = [];
            }

            for(var i in datas){
                if(typeof datas[i][value_key] == 'undefined'){
                    return ;
                }
                result[result.length] = datas[i][value_key] + '';
                if(typeof datas[i][chindrens_key] == "object"){
                    treeFirst(datas[i][chindrens_key],value_key,chindrens_key,result);
                }
                break;
            }
            return result;
        };

        return {
            restrict: 'A', //属性
            //templateUrl : '/bower_components/angular-fengtingxun/src/directives/multilevel-move.html',
            scope:{data:'='+dataKey,config:'='+configKey,area:'=ngModel'},
            template:'<div>'+
                       '<span ng-repeat="(key,value) in seleceLength">'+
                       '    <label>{{main_config[\'label\'][key]}}</label>'+
                       '    <select name="{{main_config[\'element_name\'] ? main_config[\'element_name\']+\'[]\' : \'\'}}" ng-model="area[key]" ng-change="change(area[key],key)" >'+
                       '        <option ng-if="main_config[\'empty\'] !==false" value="">{{main_config[\'empty\'][key] || \'请选择\'}}</option>'+
                       '        <option ng-repeat="x in value" value="{{x[main_config[\'value\']]}}">{{x[main_config[\'show\']]}}</option>'+
                       '    </select>'+
                       '</span>' +
                    '</div>',
            replace:true,
            link: function (scope,element, attr) {
                //现在使用配置
                scope.main_config = fengtingxun.overCinfig(config,scope.config);

                //不需要未选择提示时,将设置为自动选择第一个值
                if(scope.main_config['empty']===false){
                    scope.main_config['selected'] = true;
                }

                //选中值
                scope.area = typeof scope.area == "object" ? scope.area : [];

                for (var i in scope.area){
                    scope.area[i] = scope.area[i]+''; //类型转换
                }

                //监听数据源改变
                scope.$watch('data', function (value) {

                    //获取数据
                    var datas = angular.copy(value);

                    //非树状结构转换树状结构
                    if(scope.main_config['margin_tree']){
                        datas = toTree(datas,scope.main_config['primary_key'],scope.main_config['parent_key'], scope.main_config['childrens_key']);
                    }

                    //将主键设置成key标记
                    scope.datas =  keyBy(datas,scope.main_config['value'],scope.main_config['childrens_key']);

                    //默认选中第一个
                    if(scope.main_config['selected'] && !scope.area.length){
                        scope.area = treeFirst(scope.datas,scope.main_config['value'],scope.main_config['childrens_key']);
                    }

                    //默认显示第一级
                    scope.seleceLength = [scope.datas];
                    //循环显示后面层级
                    for (var i=0;i<scope.area.length;i++){
                        if(typeof scope.seleceLength[i]=='undefined' || typeof scope.seleceLength[i]['id_'+scope.area[i]]=='undefined'){
                            scope.seleceLength.splice(i,scope.seleceLength.length-i);
                            scope.area.splice(i,scope.area.length-i);
                            break;
                        }
                        if(typeof scope.seleceLength[i]['id_'+scope.area[i]][scope.main_config['childrens_key']]!='undefined'){
                            scope.seleceLength[i+1] = scope.seleceLength[i]['id_'+scope.area[i]][scope.main_config['childrens_key']];
                        }
                    }
                });

                /**
                 * 改变值方法
                 * @param value 选择的值
                 * @param select_index 第几个select
                 */
                scope.change = function(value,select_index){

                    //数据源
                    var datas = scope.seleceLength[select_index];

                    //选择存在子节点,添加子节点选项
                    if(typeof datas['id_'+value]=='object' && typeof datas['id_'+value][scope.main_config['childrens_key']]=="object"){
                        //下一级select的数据
                        scope.seleceLength[select_index+1] = datas['id_'+value][scope.main_config['childrens_key']];
                        //如果设置了默认选择
                        if(scope.main_config['empty']===false){
                            scope.area = scope.area.concat(treeFirst(scope.seleceLength[select_index+1],scope.main_config['value'],scope.main_config['childrens_key']));
                        }
                        //不存在子节点,删除子节点选项
                    }else {
                        //删除后面的select
                        scope.seleceLength.splice(select_index+1,scope.seleceLength.length-(select_index+1));
                        //删除后面的无效选择
                        scope.area.splice(select_index+1,scope.area.length-(select_index+1));
                    }
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