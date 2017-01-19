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