# build-cli

<p align='left'>
  <a href='https://www.npmjs.com/package/@gogogosir/build-cli'>
    <img src="https://img.shields.io/npm/v/@gogogosir/build-cli?color=41b883&label=npm" />
  </a>
  <a href='https://www.npmjs.com/package/@gogogosir/build-cli'>
    <img src="https://img.shields.io/npm/l/@gogogosir/build-cli?label=npm" />
  </a>
</p>

🦄 项目的打包脚本

<img src="./static/eg.gif" />

## 背景

当使用微前端将一个庞大的项目拆分成一个个小的应用的时候，难免不了应用之间项目依赖的情况。为了解决这个问题，一般有两种方案：1、 将项目相互依赖的部分抽离一个 npm 包，每个应用安装即可；2、将被依赖项目的路径配置在 alias （例如：在 ```webpack``` 中 alias）中；3、使用 **module federation**，如果采用方案二的话，在项目打包时，就必须把本地所依赖的项目切换到目标分支并拉取最新的记录，才能执行打包命令。这无疑增加了许多工作量。

## 执行流程

- **查找所依赖的项目** 在用户的工作区查找是否存在所依赖的项目，如果不存在则会主动从远端仓库克隆下来，并为其安装好依赖
- **用户勾选打包配置** 让用户自定义其打包的配置项
- **构建打包** 首先会把所依赖的项目切到目标分支并拉取最新的代码，然后执行打包命令，如果是构建测试环境的包，在打包成功后会创建一个 **test-projectName** 的分支和一个 **projectName.zip** 的压缩包。如果是构建预发布环境的包，在打包成功后会创建一个 **staging** 的分支和一个 **projectName.zip** 的压缩包。
- **释放被 stash 的记录** 如果所依赖的项目的 git 工作区是不干净的，则会先 stash 掉，然后在切换分支，当脚本执行完打包脚本后，会自动把所依赖的项目切回之前的分支，并释放被 stash 的记录

## 安装

```bash
// npm
npm install @gogogosir/build-cli -D

// yarn
yarn add @gogogosir/build-cli -D
```

## 使用

- **在根目录下新建一个 ```.build-cli.js``` 文件：**

```js
const pkg = require('./package.json')

module.exports = {
  projectName: pkg.name,
  distName: 'dist', // 这个配置根据你项目的webpack的output而定
  targetBranch: {
    staging: 'npm run build' // staging 表示对应的目标分支名，其对应的 value 代表选择该分支构建时要运行的构建命令
  },
  // 以下参数是非必传
  dependencies: [
    // {
    //   remoteUrl: '请填写项目的git地址',
    //   defaultBranch: 'master',
    //   packageManager: 'yarn', // 可选，包管理器
    //   installCommand: ['npm link xxx'] // 可选，install后额外执行的命令
    // }
  ],
  dependenciesWorkspace: 'BUILD_CLI_WORKSPACE' // 定义工作区的路径地址
}
```

- **在 ```package.json``` 中添加以下配置：**

```
"scripts": {
  "build": "build-cli"
}
```

- **如果 dependencies 有值，您还需配置  dependenciesWorkspace 所绑定的 node 环境的变量**

**方式一：**


**找到 ```.zshrc``` 文件并配置：**

用例：将 **BUILD_CLI_WORKSPACE** 指定为 **/Users/mac/Desktop**

```
export BUILD_CLI_WORKSPACE=/Users/mac/Desktop
```

**方式二：**

**1. 在根目录新增 ```.env.workspace```**

```
BUILD_CLI_WORKSPACE="/Users/mac/Desktop"
```

**2. 配置 ```.gitignore```**

```
.env.workspace
```

**4. 配置 ```package.json```**

```json
"scripts": {
  "build": "build-cli -e workspace"
}
```

## 参数配置

**projectName**

类型：```String```

是否必填: ```true```

项目名称
<br/>

**distName**

类型：```String```

是否必填: ```true```

打包后的目录名
<br/>

**targetBranch**

类型：```Record<string, string>```

是否必填: ```true```

默认值： ```{}```

打包时对应的目标分支和其构建命令的映射

例如：
```js
{
  targetBranch: {
    staging: 'npm run build' // staging 表示对应的目标分支名，其对应的 value 代表选择该分支构建时要运行的构建命令
  }
}
```

效果：

<img src="./static/eg2.jpg" />

<br/>

**dependenciesWorkspace**

类型：```String```

是否必填: ```false```

默认值： ```BUILD_CLI_WORKSPACE```

一个 node 的全局变量名，用户存放所依赖项目的工作区地址
<br/>

使用绝对路径:

```
BUILD_CLI_WORKSPACE1="/Users/mac/Desktop"
```

相对路径: **(相对路径是相对 process.cwd())**
```
BUILD_CLI_WORKSPACE1=".."
```

<br/>

**dependencies**

类型：```Array<DepType>```

是否必填: ```false```

默认值： ```[]```

所依赖的项目的一些配置

用例:

```js
{
  dependencies: [{
    remoteUrl: 'xxxx',
    defaultBranch: 'master',
    packageManager: 'yarn',
    installCommand: ['npm link xxx']
  }]
}
```
<br/>

**DepType 类型说明：**

**remoteUrl**

类型：```String```

是否必填: ```true```

默认值： ```''```

git 仓库地址
<br/>

**defaultBranch**

类型：```String```

是否必填: ```false```

默认值： ```''```

默认选中的分支名
<br/>

**packageManager**

类型：```String```

是否必填: ```false```

默认值： ```''```

在安装依赖时的包管理器，如果用户不传入该值，则优先使用 yarn, 如果用户没有安装 yarn 则使用 npm
<br/>

**installCommand**

类型：```Array<string>```

是否必填: ```false```

默认值： ```[]```

在执行完 install 后，运行的其他命令，例如用例中的 npm link xxx
<br/>

## Q&A

**1. 因为 node 版本的原因，在项目安装依赖时报错**

<p style="text-indent: 2em">这个就必须由用户自己切换至合适的 node 版本，手动 install 依赖</p>

**2. 为什么 **dependenciesWorkspace** 所绑定的是 node 的环境变量名**

<p style="text-indent: 2em">为了减少团队成员因为存放项目的目录地址的不同而造成不必要的冲突。</p>

**3. 如何自定义配置文件的路径**


```
"scripts": {
  "build": "build-cli -c scripts/xxx.js"
}
```

