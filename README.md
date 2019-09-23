# react-native-navigation-helper

这个包是对 [react-native-navigation](https://github.com/wix/react-native-navigation) 的扩展，它能让你更轻松地在项目中使用 react-native-navigation 。

遇到问题？请[反馈到这里](https://github.com/caoyongfeng0214/react-native-navigation-helper/issues)。

<br>

> ## Usage

1. 首先需安装 react-native-navigation ，可参考这个网址进行安装：

    [https://wix.github.io/react-native-navigation/#/docs/Installing](https://wix.github.io/react-native-navigation/#/docs/Installing) 。

    版本要求 >= 3.2.0，更低版本的没测试过，不确定是否兼容。

1. 使用 npm 安装 react-native-navigation-helper ：
    ```
    npm install react-native-navigation-helper --save
    ```

1. 修改项目的启动文件（默认为根目录下的 `./index.js`）：
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

<br>

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

<br>

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
上面的示例明确地要求以 `modal` 方式打开 `detail` 页面。

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
还可以设置在导航后执行的 function：
```js
<View>
    <Button
        title="Click Me"
        $href={{
            url: 'detail',
            type: 'modal',
            data: {id: 100},
            afterNav: this.$close
        }}/>
</View>
```
上面的示例在导航后执行 `this.$close()` 关闭当前面。

如果希望在 `js` 代码中进行导航，则可用 `this.$go(cmd)`：
```js
class Index extends $Nav.Page {
    constructor(props) {
        super(props);
    }
    
    goDetail = () => {
        this.$go('detail');
    }
    
    render() {
        return (
            <View>
                <Button title="Navigation to Detail" onPress={this.goDetail}/>
            </View>
        );
    }
}
```
`this.$go(cmd)` 的参数与 `$href` 属性的值一样，也可以是 `object`：
```js
this.$go({
    url: 'detail',
    type: 'modal',
    data: {id: 100}
});
```

<br>

***

> ## $Nav.Page

所有的页面都应从 `$Nav.Page` 继承。

从 `$Nav.Page` 继承的页面有以下属性、方法：

* #### $close()

  关闭当前页面。

* #### $go(options)

  导航到指定页面。

* #### $setOptions(options)

  `options` 参数的值参考这里：[https://wix.github.io/react-native-navigation/#/docs/styling?id=options-object-format](https://wix.github.io/react-native-navigation/#/docs/styling?id=options-object-format)
  
* #### props.$opener

  当前页面是从哪个页面打开的。
  
* #### props.$data

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

<br>

***

> ## 路由拦截

通过路由拦截，可阻止页面导航或改变导航页面。

在 `$Nav.init(options)` 参数中配置 `beforeNav`，它是一个 function，在页面导航之前执行，它需返回 `Promise` 或 `真` 与 `假`。
```js
$Nav.init({
    // ......
    beforeNav: function(fromPage, to, toObj){
        if(to == 'profile' && !isAuthorized()){
            fromPage.$go({
                url: 'login',
                type: 'modal'
            });
            return false;
        }
        return true;
    },
    // ......
});
```
`beforeNav` 会被传入三个参数，第一个参数 `fromPage` 是当前页面对象，第二个参数 `to` 是即将导航到的页面的名字，第三个参数是即将导航到的页面的定义，它是 `$Nav.Page class` 或 `options.layout` 中定义的有基本布局的页面（参考后面的文档）。

如果返回的不是 `Promise`，返回 `假` 则阻止导航。

如果返回 `Promise`，则 `resolve` `假` 将阻止导航。

<br>

***

> ## sideMenu

`sideMenu` 有左边栏、右边栏、中间主体部分。其中左边栏和右边栏是可选的。

参考：[https://wix.github.io/react-native-navigation/#/docs/layout-types?id=sidemenu](https://wix.github.io/react-native-navigation/#/docs/layout-types?id=sidemenu)

```js
$Nav.init({
    // ......
    promises: [
        MaterialIcons.getImageSource('menu', 25)
    ],
    layout: function(iconMenu){
        return {
            root: {
                sideMenu: {
                    left: {
                        component: {
                            name: 'sidemenuleft'
                        }
                    },
                    center: {
                        stack: {
                            children: [{
                                component: {
                                    name: 'index',
                                    options: {
                                        topBar: {
                                            leftButtons: [{
                                                id: 'btnToggleLeft',
                                                icon: iconMenu
                                            }]
                                        }
                                    }
                                }
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
`sideMenu` 由三个页面组成。在中间主体部分的页面中，可用 `this.$toggleLeft()` 切换左边栏的显示状态：
```js
class Index extends $Nav.Page {
    constructor(props) {
        super(props);
    }
    
    navigationButtonPressed = ({buttonId}) => {
        if (buttonId === 'btnToggleLeft') {
            this.$toggleLeft();
        }
    }
    
    render() {
        // ......
    }
}
```
也可用 `this.$openLeft()` 和 `this.$closeLeft()` 打开、关闭左边栏。

可用 `this.$left` 访问左边栏页面对象。

同理，可用 `this.$toggleRight()`、`this.$openRight()`、`this.$closeRight()` 切换右边栏显示状态、打开右边栏、关闭右边栏，用 `this.$right` 访问右边栏页面对象。

在左边栏或右边栏页面中，可用 `this.$open()`、`this.$close()` 打开、关闭自己：
```js
class SideMenuLeft extends $Nav.Page {
    render() {
        return (
            <View>
                <Button title="Close" onPress={this.$close}/>
            </View>
        );
    }
}
```
也可用 `this.$center` 访问中间主体页面对象。

<br>

***

> ## bottomTabs

在 `bottomTabs` 的每个选项卡页面中，可用 `this.$tab(tabIndex)` 切换到指定的选项卡：
```js
<Button title="tab1" onPress={()=>this.$tab(1)}/>
```
可用 `this.$tabsHide()`、`this.$tabsShow()` 显示、隐藏底部的选项卡栏：
```js
<Button title="hide tabs" onPress={()=>this.$tabsHide()}/>
```

<br>

***

> ## 导航到有基本布局的页面

如果导航的目标页不是简单的 `$Nav.Page`，而是由多个 `$Nav.Page` 组合而成的有基本布局的页面（例如 `sideMenu`、`bottomTabs`），则需在 `$Nav.init(options)` 的 `layout` 中进行配置：
```js
$Nav.init({
    // ......
    layout: {
        root: {
            // ......
        },
        shop: {
            bottomTabs: {
                children: [{
                    stack: {
                        children: [{
                            component: {
                                name: 'shopindex'
                            }
                        }],
                        options: {
                            bottomTab: {
                                text: 'Shop',
                                icon: require('./imgs/tab0.png')
                            }
                        }
                    }
                }, {
                    component: {
                        name: 'orders',
                        options: {
                            bottomTab: {
                                text: 'Orders',
                                icon: require('./imgs/tab1.png')
                            }
                        }
                    }
                }]
            }
        }
    },
    // ......
});
```
之后就可像下面这样导航到上面配置的 `shop` 页了：
```js
<Button title="Shop" $href="shop"/>
```
或者：
```js
this.$go({
    url: 'shop',
    type: 'modal'
});
```
`layout` 根节点 `key` 会被当作页面的名字，因此不能与其它页面的名字重复。

对于打开的由多个页面组成的有基本布局的页面，无法用 `this.$close()` 关闭它，而应该用 `this.$closeWin()`。

<br>

***

> ## $Nav.setOptions(componentId, options)

与 `react-native-navigation` 中的 `Navigation.mergeOptions(componentId, options)` 等效。

参考：[https://wix.github.io/react-native-navigation/#/docs/styling?id=setting-styles-dynamically](https://wix.github.io/react-native-navigation/#/docs/styling?id=setting-styles-dynamically) 。

在一个页面中，
```js
this.$setOptions({
    topBar: {
        title: {
            text: 'Hello CYF'
        }
    }
});
```
与
```js
$Nav.setOptions(this.props.componentId, {
    topBar: {
        title: {
            text: 'Hello CYF'
        }
    }
});
```
是等效的。

<br>

***

> ## 更多....

`react-native-navigation-helper` 提供的功能是有限的，可能并不能完全满足你的需求。你可以用 `$Nav.nav` 直接使用 `react-native-navigation` 中的 `Navigation` 对象。当然，你也可以直接在项目中 import react-native-navigation。
