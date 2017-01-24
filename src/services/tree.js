/**
 * Created by zhangshiping on 2017/1/22.
 * 辅助方法过滤器
 */
(function (window) {'use strict';
    //定义模块名称
    var MODULE_NAME = 'tree';

    /**
     * 树状结构处理服务
     * @type {{}}
     */
    var service = {};

    service.tree = function(){
        /**
         * 数据库表结构数据转换成树状结构
         * @param a
         * @param idStr
         * @param pidStr
         * @param chindrenStr
         * @returns {Array}
         */
        this.toTree = function (a, idStr, pidStr, chindrenStr){
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

        /**
         * 树状结构下的第一级的第一级....
         * @param datas
         * @param value_key
         * @param chindrens_key
         * @param result
         * @returns {*}
         */
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
        this.treeFirst = treeFirst;
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
        this.keyBy = keyBy;

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