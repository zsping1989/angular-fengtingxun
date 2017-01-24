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
    },
    modules:{
        paths: {
            'tree':'/bower_components/angular-fengtingxun/src/services/tree',
            'url':'/bower_components/angular-fengtingxun/src/services/url',
            'helpers':'/bower_components/angular-fengtingxun/src/filters/helpers',
            'multilevelMove':'/bower_components/angular-fengtingxun/src/directives/multilevel-move',
            'paginate':'/bower_components/angular-fengtingxun/src/directives/paginate'
        },
        shim: {
            'tree':{
                deps: ['angular','fengtingxun']
            },
            'url':{
                deps: ['angular','fengtingxun']
            },
            'helpers':{
                deps: ['angular','fengtingxun']
            },
            'multilevelMove':{
                deps: ['angular','tree','fengtingxun']
            },
            'paginate':{
                deps: ['angular','url','fengtingxun']
            }
        }
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
if ( typeof define === "function" && define.amd && typeof requirejs === "function" ) {
    require.config(fengtingxun.modules);
    define('fengtingxun',[],function(){
        return fengtingxun;
    });
}