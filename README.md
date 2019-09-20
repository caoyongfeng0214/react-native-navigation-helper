# react-native-navigation-helper

这个包是对 [react-native-navigation](https://github.com/wix/react-native-navigation) 的扩展，它能让你更轻松地在项目中使用 react-native-navigation 。

## Usage

1、需先安装 react-native-navigation ，可参考这个网址进行安装：

[https://wix.github.io/react-native-navigation/#/docs/Installing](https://wix.github.io/react-native-navigation/#/docs/Installing) 。

2、使用 npm 安装 react-native-navigation-helper ：
```
npm install react-native-navigation-helper --save
```

3、修改项目的启动文件（默认为根目录下的 `./index.js`）：
```js
import $Nav from 'react-native-navigation-helper';
import App from './App';

$Nav.init({
    pages: {
        'app': App
    },
    layout: {
        root: {
            component: {
                name: 'app'
            }
        }
    }
});
```

## $Nav.init(options)

### options.defaultOptions：设置默认选项
```js
$Nav.init({
    // .......
    defaultOptions: {
        layout: {
            backgroundColor: 'yellow'
        }
    }
    // ......
});
```
更多可配置参数请参考这里：

[https://wix.github.io/react-native-navigation/#/docs/styling?id=options-object-format](https://wix.github.io/react-native-navigation/#/docs/styling?id=options-object-format)

### options.pages：key-value，项目中的所有页面（Screen）

建议将所有页面文件放在同一个文件夹下，例如 `./pages/` ：
```
|--node_modules
|--pages
|    |--index.js
|    |--news.js
|    |--detail.js
|--package.json
```
所有页面类都应从 `$Nav.Page` 继承，否则可能无法使用某些功能：
```js
// React 是必须的
import React from 'react';
import {View, Text} from 'react-native';

// $Nav 是全局变量，在此文件中不用 import
class News extends $Nav.Page {
    constructor(props){
        super(props);
    }
    
    render() {
        return (
            <View>
                <Text>This is News</Text>
            </View>
        );
    }
}

export default News;
```
`$Nav` 是全局变量，除了在 `./index.js` ，在其它文件中不用 `import` 它。

可单独用一个文件来管理所有的页面，例如可以是 `./pages/_.js` ：
```js
export default {
    // 这里的 key 是你对每个页面的命名
    index: require('./index').default,
    news: require('./news').default,
    detail: require('./detail').default,
    // ......
};
```
则在 `./index.js` 中可这样使用：
```js
// ......
import pages from './pages/_';

$Nav.init({
    // ......
    pages: pages,
    // ......
});
```

### options.layout：JSON or function，基本布局

可以是 JSON，也可以是返回 JSON 的 function。
```js
$Nav.init({
    // ......
    layout: {
        root: {
            stack: {
                children: [{
                    component: {
                        name: 'index' // 这里的值是 options.pages 中每个页面对应的 key
                    }
                }]
            }
        }
    }
    // ......
});
```
更多配置可参考这里：

[https://wix.github.io/react-native-navigation/#/docs/layout-types](https://wix.github.io/react-native-navigation/#/docs/layout-types)

### options.promises：array，一组 Promise，一般用来预加载资源

例如，如果要用到 [react-native-vector-icons](https://github.com/oblador/react-native-vector-icons)，可在 `options.promises` 中预加载要用到的图标：
```js
// ......
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

$Nav.init({
    // ......
    promises: [
        MaterialIcons.getImageSource('home', 25),
        MaterialIcons.getImageSource('menu', 25)
    ],
    // promises 中每一个 Promise 获取到的数据将依次传入这个 function 中
    layout: function(iconHome, iconMenu){
        return {
            root: {
                stack: {
                    children: [{
                        component: {
                            name: 'index'
                        }
                    }],
                    options: {
                        topBar: {
                            leftButtons: [{
                                id: 'btnLeft',
                                icon: iconMenu
                            }]
                        }
                    }
                }
            }
        };
    }
    // ......
});
```
