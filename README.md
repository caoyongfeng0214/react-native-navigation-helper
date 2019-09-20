# react-native-navigation-helper

这个包是对 [react-native-navigation](https://github.com/wix/react-native-navigation) 的扩展，它能让你更轻松地在项目中使用 react-native-navigation 。

> ## Usage

1、首先需安装 react-native-navigation ，可参考这个网址进行安装：

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

***

> ## $Nav.init(options)

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
// import React 是必须的
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

### options.layout：object or function，基本布局

可以是 object，也可以是返回 object 的 function。
```js
$Nav.init({
    // ......
    layout: {
        root: {
            stack: {
                children: [{
                    component: {
                        name: 'index' // 这里的值是 options.pages 中某个页面对应的 key
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

***

> ## 导航

为可点击的元素添加 `$href` 属性，能轻松实现在页面间的导航：
```js
<View>
    <Button title="Click Me" $href="detail"/>
</View>
```
`$href` 属性的值可以是 `string` ，也可以是 `object` 。

当 `$href` 属性的值是 `string` 时，它指的是一个页面的名字（在 `options.pages` 中设置的）。当用户点击该元素后，将打开这个页面。

`react-native-navigation-helper` 会根据当前的环境智能地判断是应该使用 `push` 打开，还是使用 `modal` 或 `overlay` 打开。

但开发者的需求是有可能非常态的，如果默认的打开方式不适合你的需求，你可以明确地指定打开方式：
```js
<View>
    <Button
        title="Click Me"
        $href={{
            url: 'detail',
            type: 'modal'
        }}/>
</View>
```
上面的代码明确地要求以 `modal` 方式打开 `detail` 页面。

`type` 的值可以是 `push`、`modal`、`overlay`。

如果需要传递参数给打开的页面，则使用 `data` 传递：
```js
<View>
    <Button
        title="Click Me"
        $href={{
            url: 'detail',
            type: 'modal',
            data: {id: 100}
        }}/>
</View>
```

***

> ## $Nav.Page

所有的页面都应从 `$Nav.Page` 继承。

从 `$Nav.Page` 继承的页面有以下属性、方法：

* $close()

  关闭当前页面。
  
* props.$opener

  当前页面是从哪个页面打开的。
  
* props.$data

  `opener` 打开当前页面时传递过来的参数。
```js
import React from 'react';
import {View, Text, Button} from 'react-native';

class News extends $Nav.Page {
    constructor(props){
        super(props);
        
        // 当前页面的 opener 传递过来的参数
        console.log(props.$data);
    }
    
    render() {
        return (
            <View>
                <Text>This is News</Text>
                <View>
                    <Button title="Close" onPress={this.$close}/>
                </View>
            </View>
        );
    }
}

export default News;
```

***

> ## sideMenu
