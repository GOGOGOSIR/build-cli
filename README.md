# build-cli

<p align='left'>
  <a href='https://www.npmjs.com/package/@gogogosir/build-cli'>
    <img src="https://img.shields.io/npm/v/@gogogosir/build-cli?color=41b883&label=npm" />
  </a>
  <a href='https://www.npmjs.com/package/@gogogosir/build-cli'>
    <img src="https://img.shields.io/npm/l/@gogogosir/build-cli?label=npm" />
  </a>
</p>

ð¦ é¡¹ç®çæåèæ¬

<img src="./static/eg.gif" />

## èæ¯

å½ä½¿ç¨å¾®åç«¯å°ä¸ä¸ªåºå¤§çé¡¹ç®æåæä¸ä¸ªä¸ªå°çåºç¨çæ¶åï¼é¾åä¸äºåºç¨ä¹é´é¡¹ç®ä¾èµçæåµãä¸ºäºè§£å³è¿ä¸ªé®é¢ï¼ä¸è¬æä¸ç§æ¹æ¡ï¼1ã å°é¡¹ç®ç¸äºä¾èµçé¨åæ½ç¦»ä¸ä¸ª npm åï¼æ¯ä¸ªåºç¨å®è£å³å¯ï¼2ãå°è¢«ä¾èµé¡¹ç®çè·¯å¾éç½®å¨ alias ï¼ä¾å¦ï¼å¨ ```webpack``` ä¸­ aliasï¼ä¸­ï¼3ãä½¿ç¨ **module federation**ï¼å¦æéç¨æ¹æ¡äºçè¯ï¼å¨é¡¹ç®æåæ¶ï¼å°±å¿é¡»ææ¬å°æä¾èµçé¡¹ç®åæ¢å°ç®æ åæ¯å¹¶æåææ°çè®°å½ï¼æè½æ§è¡æåå½ä»¤ãè¿æ çå¢å äºè®¸å¤å·¥ä½éã

## æ§è¡æµç¨

- **æ¥æ¾æä¾èµçé¡¹ç®** å¨ç¨æ·çå·¥ä½åºæ¥æ¾æ¯å¦å­å¨æä¾èµçé¡¹ç®ï¼å¦æä¸å­å¨åä¼ä¸»å¨ä»è¿ç«¯ä»åºåéä¸æ¥ï¼å¹¶ä¸ºå¶å®è£å¥½ä¾èµ
- **ç¨æ·å¾éæåéç½®** è®©ç¨æ·èªå®ä¹å¶æåçéç½®é¡¹
- **æå»ºæå** é¦åä¼ææä¾èµçé¡¹ç®åå°ç®æ åæ¯å¹¶æåææ°çä»£ç ï¼ç¶åæ§è¡æåå½ä»¤ï¼å¦ææ¯æå»ºæµè¯ç¯å¢çåï¼å¨æåæååä¼åå»ºä¸ä¸ª **test-projectName** çåæ¯åä¸ä¸ª **projectName.zip** çåç¼©åãå¦ææ¯æå»ºé¢åå¸ç¯å¢çåï¼å¨æåæååä¼åå»ºä¸ä¸ª **staging** çåæ¯åä¸ä¸ª **projectName.zip** çåç¼©åã
- **éæ¾è¢« stash çè®°å½** å¦ææä¾èµçé¡¹ç®ç git å·¥ä½åºæ¯ä¸å¹²åçï¼åä¼å stash æï¼ç¶åå¨åæ¢åæ¯ï¼å½èæ¬æ§è¡å®æåèæ¬åï¼ä¼èªå¨ææä¾èµçé¡¹ç®ååä¹åçåæ¯ï¼å¹¶éæ¾è¢« stash çè®°å½

## node çæ¬

node çæ¬éå¤§äºç­äº ```v14.16.0```

## å®è£

```bash
// npm
npm install @gogogosir/build-cli -D

// yarn
yarn add @gogogosir/build-cli -D
```

## ä½¿ç¨

- **å¨æ ¹ç®å½ä¸æ°å»ºä¸ä¸ª ```.build-cli.js``` æä»¶ï¼**

```js
const pkg = require('./package.json')

module.exports = {
  projectName: pkg.name,
  distName: 'dist', // è¿ä¸ªéç½®æ ¹æ®ä½ é¡¹ç®çwebpackçoutputèå®
  targetBranch: {
    staging: 'npm run build' // staging è¡¨ç¤ºå¯¹åºçç®æ åæ¯åï¼å¶å¯¹åºç value ä»£è¡¨éæ©è¯¥åæ¯æå»ºæ¶è¦è¿è¡çæå»ºå½ä»¤
  },
  // ä»¥ä¸åæ°æ¯éå¿ä¼ 
  dependencies: [
    // {
    //   remoteUrl: 'è¯·å¡«åé¡¹ç®çgitå°å',
    //   defaultBranch: 'master',
    //   packageManager: 'yarn', // å¯éï¼åç®¡çå¨
    //   installCommand: ['npm link xxx'] // å¯éï¼installåé¢å¤æ§è¡çå½ä»¤
    // }
  ],
  dependenciesWorkspace: 'BUILD_CLI_WORKSPACE' // å®ä¹å·¥ä½åºçè·¯å¾å°å
}
```

- **å¨ ```package.json``` ä¸­æ·»å ä»¥ä¸éç½®ï¼**

```
"scripts": {
  "build": "build-cli"
}
```

- **å¦æ dependencies æå¼ï¼æ¨è¿ééç½®  dependenciesWorkspace æç»å®ç node ç¯å¢çåé**

**1. å¨æ ¹ç®å½æ°å¢ ```.env.workspace```**

ç»å¯¹è·¯å¾çéç½®æ¹å¼çç¨ä¾:

```
BUILD_CLI_WORKSPACE="/Users/mac/Desktop"
```

ç¸å¯¹è·¯å¾çéç½®æ¹å¼çç¨ä¾:

ç¸å¯¹äº ```process.cwd()```çè·¯å¾

```
BUILD_CLI_WORKSPACE=".."
```

**2. éç½® ```.gitignore```ï¼å¯éï¼æ ¹æ®å®ééæ±èå®ï¼**

```
.env.workspace
```

**4. éç½® ```package.json```**

```json
"scripts": {
  "build": "build-cli -e workspace"
}
```

## åæ°éç½®

**projectName**

ç±»åï¼```String```

æ¯å¦å¿å¡«: ```true```

é¡¹ç®åç§°
<br/>

**distName**

ç±»åï¼```String```

æ¯å¦å¿å¡«: ```true```

æååçç®å½å
<br/>

**targetBranch**

ç±»åï¼```Record<string, string>```

æ¯å¦å¿å¡«: ```true```

é»è®¤å¼ï¼ ```{}```

æåæ¶å¯¹åºçç®æ åæ¯åå¶æå»ºå½ä»¤çæ å°

ä¾å¦ï¼
```js
{
  targetBranch: {
    staging: 'npm run build' // staging è¡¨ç¤ºå¯¹åºçç®æ åæ¯åï¼å¶å¯¹åºç value ä»£è¡¨éæ©è¯¥åæ¯æå»ºæ¶è¦è¿è¡çæå»ºå½ä»¤
  }
}
```

ææï¼

<img src="./static/eg2.jpg" />

<br/>

**dependenciesWorkspace**

ç±»åï¼```String```

æ¯å¦å¿å¡«: ```false```

é»è®¤å¼ï¼ ```BUILD_CLI_WORKSPACE```

ä¸ä¸ª node çå¨å±åéåï¼ç¨æ·å­æ¾æä¾èµé¡¹ç®çå·¥ä½åºå°å

**egï¼**

```
BUILD_CLI_WORKSPACE1=".."
```

<br/>

**dependencies**

ç±»åï¼```Array<DepType>```

æ¯å¦å¿å¡«: ```false```

é»è®¤å¼ï¼ ```[]```

æä¾èµçé¡¹ç®çä¸äºéç½®

ç¨ä¾:

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

**DepType ç±»åè¯´æï¼**

**remoteUrl**

ç±»åï¼```String```

æ¯å¦å¿å¡«: ```true```

é»è®¤å¼ï¼ ```''```

git ä»åºå°å
<br/>

**defaultBranch**

ç±»åï¼```String```

æ¯å¦å¿å¡«: ```false```

é»è®¤å¼ï¼ ```''```

é»è®¤éä¸­çåæ¯å
<br/>

**packageManager**

ç±»åï¼```String```

æ¯å¦å¿å¡«: ```false```

é»è®¤å¼ï¼ ```''```

å¨å®è£ä¾èµæ¶çåç®¡çå¨ï¼å¦æç¨æ·ä¸ä¼ å¥è¯¥å¼ï¼åä¼åä½¿ç¨ yarn, å¦æç¨æ·æ²¡æå®è£ yarn åä½¿ç¨ npm
<br/>

**installCommand**

ç±»åï¼```Array<string>```

æ¯å¦å¿å¡«: ```false```

é»è®¤å¼ï¼ ```[]```

å¨æ§è¡å® install åï¼è¿è¡çå¶ä»å½ä»¤ï¼ä¾å¦ç¨ä¾ä¸­ç npm link xxx
<br/>

## Q&A

**1. å ä¸º node çæ¬çåå ï¼å¨é¡¹ç®å®è£ä¾èµæ¶æ¥é**

<p style="text-indent: 2em">è¿ä¸ªå°±å¿é¡»ç±ç¨æ·èªå·±åæ¢è³åéç node çæ¬ï¼æå¨ install ä¾èµ</p>

**2. ä¸ºä»ä¹ **dependenciesWorkspace** æç»å®çæ¯ node çç¯å¢åéå**

<p style="text-indent: 2em">ä¸ºäºåå°å¢éæåå ä¸ºå­æ¾é¡¹ç®çç®å½å°åçä¸åèé æä¸å¿è¦çå²çªã</p>

**3. å¦ä½èªå®ä¹éç½®æä»¶çè·¯å¾**


```
"scripts": {
  "build": "build-cli -c scripts/xxx.js"
}
```

