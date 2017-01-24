/**
 * 单个模块加载
 * Created by zhangshiping on 2017/1/24.
 */
/* 调试打印 */
function dump(){
    for (var i = 0; i < arguments.length; ++i) {
        console.log(arguments[i]);
    }
}

requirejs.config({
    paths: {
        'angular': '../../angular/angular.min',
        'fengtingxun':'../src/config',
        'ctrl':'./alone-load/indexCtr'
    },
    shim: {
        'angular': {
            exports: 'angular'
        },
        'ctrl':{
            deps:['angular','fengtingxun']
        }
    },
    deps:['ctrl'],
   // urlArgs: "version=" + (new Date()).getTime()
});

