/**
 * Created by zhangshiping on 2017/1/24.
 */
/* 调试打印 */
function dump(){
    for (var i = 0; i < arguments.length; ++i) {
        console.log(arguments[i]);
    }
}

require.config({
    paths: {
        'angular': '../../../angular/angular.min',
        'fengtingxun':'../../src/config'
    },
    shim: {
        'angular': {
            exports: 'angular'
        },
        'fengtingxun':{
            deps: ['angular']
        }
    },
    deps:['fengtingxun'],
    urlArgs: "version=" + (new Date()).getTime()
});

require(['fengtingxun'], function (fengtingxun) {
    require(['angular','multilevelMove','helpers'],function(angular){
        //创建应用
        var app = angular.module('app',['ngFengTingXun.directives.multilevelMove','ngFengTingXun.filters.helpers']);

        //创建控制器
        app.controller('myCtrl',function($scope){
            dump($scope);
            //联动数据绑定
            $scope.area = [];

            //树状结构数据
            $scope.data = [
                {
                    "id":2,
                    "name":'四川',
                    "parent_id":1,
                    "childrens":[
                        {
                            "id":4,
                            "name":'成都',
                            "parent_id":2
                        },
                        {
                            "id":5,
                            "name":'资阳',
                            "parent_id":2,
                            "childrens":[
                                {
                                    "id":6,
                                    "name":'雁江区',
                                    "parent_id":5
                                },
                                {
                                    "id":7,
                                    "name":'丰裕镇',
                                    "parent_id":5
                                }
                            ]
                        }
                    ]
                },
                {
                    "id":3,
                    "name":'湖南',
                    "parent_id":1
                }
            ];

            //树状结构数据配置
            $scope.config = {
                show : "name", //多级联动显示字段
                value : "id", //多级联动显示值
                selected:true, //是否默认选中第一个值
                label : ['省','市','区'], //每一个下拉菜单的左侧说明
                empty : ['请选择省','请选择市','请选择县'], //当没有选择值时的提示
                childrens_key : 'childrens', //子节点字段键
                element_name : 'area', //表单节点名称
                margin_tree : false //是否为数据库表结构数据
            };

            //联动数据绑定
            $scope.area1 = [];

            //数据库表结构数据
            $scope.data1 = [
                {
                    "id":2,
                    "name":'四川',
                    "parent_id":1
                },
                {
                    "id":3,
                    "name":'湖南',
                    "parent_id":1
                },
                {
                    "id":4,
                    "name":'成都',
                    "parent_id":2
                },
                {
                    "id":5,
                    "name":'资阳',
                    "parent_id":2
                },
                {
                    "id":6,
                    "name":'雁江区',
                    "parent_id":5
                },
                {
                    "id":7,
                    "name":'丰裕镇',
                    "parent_id":5
                }
            ];

            //数据库表结构数据配置
            $scope.config1 = {
                show : "name", //多级联动显示字段
                value : "id", //多级联动显示值
                selected:true, //是否默认选中第一个值
                //label : ['省','市','区'], //每一个下拉菜单的左侧说明
                empty : false,//['请选择省','请选择市','请选择县'], //当没有选择值时的提示
                childrens_key : 'childrens', //子节点字段键
                element_name : 'area', //表单节点名称
                margin_tree : true, //是否为数据库表结构数据
                primary_key : 'id', //主键
                parent_key : 'parent_id' //父级字段
            };
            $scope.change = function(){
                $scope.data= [
                    {
                        "id":2,
                        "name":'四川',
                        "parent_id":1,
                        "childrens":[
                            {
                                "id":4,
                                "name":'成都',
                                "parent_id":2
                            },
                            {
                                "id":5,
                                "name":'资阳',
                                "parent_id":2
                            }
                        ]
                    },
                    {
                        "id":3,
                        "name":'湖南',
                        "parent_id":1
                    }
                ];
            };
        });
        angular.bootstrap(document, ['app']);
    });


});