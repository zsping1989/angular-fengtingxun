
## ftx-multilevel-move


**扩展库下载:**

1. Angular下载:[ https://github.com/angular/angular](https://github.com/angular/angular.js.git)

2. ngFengTingXun(自定义)扩展下载:[ https://github.com/zsping1989/angular-fengtingxun](https://github.com/zsping1989/angular-fengtingxun.git)

3. 模块ngFengTingXun的默认配置ftx-multilevel-move-config

```javascript
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

```
4. 配置说明

| 配置项(configuration item)| 类型(type) |是否必填(required)|配置值(configuration value)|配置说明(configuration instruction)|
| :-------- | :--------:|  :--------:| :------ | :------: |
|   show   | 字符串(string)| 否(no) | 'name':(默认值-default)|  select标签选项显示的值|
|   value | 字符串(string)| 否(no) | 'id':(默认值-default)|  select标签中option的value值|
|   childrens_key |  字符串(string)| 否(no): | 'childrens'(默认值-default)|  当margin_tree=false时必须指定|
|   element_name |   字符串(string)| 否(no) | "":(默认值-default)| select标签的name属性的值|
|   label | 数组(array)| 否(no) | []:(默认值-default)|  select标签左侧的提示label|
|   margin_tree | 布尔值(bool)| 否(no) | false:(默认值-default)|  是否为数据表结构数据|
|   primary_key| 字符串(string)| 否(no) | 'id':(默认值-default)|  margin_tree = true时必填,数据主键,数据唯一标识|
|   parent_key | 字符串(string)| 否(no) | 'parent_id':(默认值-default)|  margin_tree = true时必填,数据关联键|
|   selected | 布尔值(bool)| 否(no) | false:(默认值-default)|  是否默认选中select中的第一个值|
|   empty | 数组或false(bool)| 否(no) | [false]:(默认值-default)|  为空时的默认选项值|


## ftx-multilevel-move


### 一. 树状结构数据

#### 1. JavaScript部分

```javascript

    //创建应用
    var app = angular.module('app',['ngFengTingXun']);

    //创建控制器
    app.controller('myCtrl',function($scope){
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
    });
```

#### 2.  Html代码部分

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>angular学习</title>
</head>
<body>
<!-- 引入angluar -->
<script src="bower_components/angular/angular.min.js"></script>
<!-- 引入扩展库 -->
<script src="bower_components/angular-extend/src/angular-fengtingxun.js"></script>

<!-- 创建应用 -->
<div ng-app="app">
    <div ng-controller="myCtrl">
        <div ftx-multilevel-move='data' ng-model="area" ftx-multilevel-move-config="config" ></div>
    </div>
</div>
</body>
</html>
```

### 二.数据库表类型数据

#### 1. JavaScript部分

```javascript
    //创建应用
    var app = angular.module('app',['ngFengTingXun']);

    //创建控制器
    app.controller('myCtrl',function($scope){
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
            label : ['省','市','区'], //每一个下拉菜单的左侧说明
            empty : ['请选择省','请选择市','请选择县'], //当没有选择值时的提示
            childrens_key : 'childrens', //子节点字段键
            element_name : 'area', //表单节点名称
            margin_tree : true, //是否为数据库表结构数据
            primary_key : 'id', //主键
            parent_key : 'parent_id', //父级字段
        };
    });

```
#### 2.  Html代码部分

```html

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>angular学习</title>
    <link href="bower_components/bootstrap/dist/css/bootstrap.min.css">
</head>
<body  >
<script src="bower_components/angular/angular.min.js"></script>
<script src="bower_components/angular-fengtingxun/src/angular-fengtingxun.js"></script>
<div ng-app="app">
    <div ng-controller="myCtrl">
        <div ftx-multilevel-move='data1' ng-model="area1" ftx-multilevel-move-config="config1" ></div>
    </div>
</div>

</body>
</html>

```



### 一. 树状结构数据

#### 1. JavaScript部分

```javascript

    //创建应用
    var app = angular.module('app',['ngFengTingXun']);

    //创建控制器
    app.controller('myCtrl',function($scope){
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
    });
```

#### 2.  Html代码部分

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>angular学习</title>
    <link href="bower_components/bootstrap/dist/css/bootstrap.min.css">
</head>
<body>
<!-- 引入angluar -->
<script src="bower_components/angular/angular.min.js"></script>
<!-- 引入扩展库 -->
<script src="bower_components/angular-fengtingxun/src/angular-fengtingxun.js"></script>

<!-- 创建应用 -->
<div ng-app="app">
    <div ng-controller="myCtrl">
        <div ftx-multilevel-move='data' ng-model="area" ftx-multilevel-move-config="config" ></div>
    </div>
</div>
</body>
</html>
```

### 二.数据库表类型数据

#### 1. JavaScript部分

```javascript
    //创建应用
    var app = angular.module('app',['ngFengTingXun']);

    //创建控制器
    app.controller('myCtrl',function($scope){
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
            label : ['省','市','区'], //每一个下拉菜单的左侧说明
            empty : ['请选择省','请选择市','请选择县'], //当没有选择值时的提示
            childrens_key : 'childrens', //子节点字段键
            element_name : 'area', //表单节点名称
            margin_tree : true, //是否为数据库表结构数据
            primary_key : 'id', //主键
            parent_key : 'parent_id', //父级字段
        };
    });

```
#### 2.  Html代码部分

```html

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>angular学习</title>
    <link href="bower_components/bootstrap/dist/css/bootstrap.min.css">
</head>
<body  >
<script src="bower_components/angular/angular.min.js"></script>
<script src="bower_components/angular-fengtingxun/src/angular-fengtingxun.js"></script>
<div ng-app="app">
    <div ng-controller="myCtrl">
        <div ftx-multilevel-move='data1' ng-model="area1" ftx-multilevel-move-config="config1" ></div>
    </div>
</div>

</body>
</html>

```

