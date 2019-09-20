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
