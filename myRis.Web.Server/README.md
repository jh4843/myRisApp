# myRis.Web.Server

## Project Setup

### npm install & upgrade

```
install : npm i -g npm@version

update : npm update -g / npm i -g npm@latest
```

### Tsc Build Out Path

```

./build
```

### Tsc Build

```
npm run build:ts
```

### Tsc Run

```
npm run start:ts
```

### Webpack Out Path

```
./dist
```

### Webpack Build

```
npm run build
```

### Webpack Run

```
npm run start
```

### install modules

```
npm i (-D) --save 'moduleName'

npm i --only=prod ; install modules from dependency
```

### BUILD WARNING: TSC <--> WEBPACK SWITCH

```
package.json - type:module (add for TSC / remove for Webpack)
in some ts file - import (add for .js / remove for Webpack)
```

### package-lock.json

```
https://junwoo45.github.io/2019-10-02-package-lock/
```

### Webpack plug-ins

```
NodemonPlugin - for watching realtime code changes

CleanWebpackPlugin - build시 dist 폴더 내용 다 날리고 빌드

TerserPlugin - build 시 LICESNE.txt 파일 없앰
```

### qckwinsvc & cmd 실행시

```
[bundle.js 가 설치된 위치를 path로 지정해야 함]

Install qckwinsvc : npm i qckwinsvc

Windows service : qckwinsvc /qckwinsvc --uninstall

Run program : node bundle.js

```
