const fs   = require('fs');
const path = require('path');

const type          = process.argv[2]; // vue или twig
const dir           = process.argv[3]; // что делаем m a o
const componentName = process.argv[4].toLowerCase(); // название компонента

if(!componentName || !type || !dir) {
  console.log('Вы указали не все параметры');
  process.exit(1);
}

// тип отступов
const tabs = '    ';

// пути дирректорий
const dirOrganisms  = "/src/include/&organisms";
const dirMolecules  = "/src/include/^molecules";
const dirAtoms      = "/src/include/@atoms";

// файлы
const filesName = {
  json : `${componentName}.json`,
  scss : `${componentName}.scss`,
  twig : `${componentName}.twig`,
  js   : `${componentName}.js`,
  vue  : `${componentName}.vue`,
};

// внутренности файлов
const jsInner = ``;

const inners = {
  json : `{
${tabs}
}
`,
  scss : `.${componentName} {
${tabs}
}
`,
  twig : `<div class="${componentName}">
${tabs}
</div>
`,
  js  : jsInner,
  vue : `<template>
${tabs}<div class="${componentName}">
${tabs}${tabs}
${tabs}</div>
</template>

<script>

export default {
${tabs}props : {
${tabs}${tabs}
${tabs}},

${tabs}data() {
${tabs}${tabs}return {
${tabs}${tabs}${tabs}
${tabs}${tabs}};
${tabs}},

${tabs}computed : {
${tabs}${tabs}
${tabs}},

${tabs}methods : {
${tabs}${tabs}
${tabs}},
</script>

<style lang="scss">
.${componentName} {
${tabs}
}
</style>
`
};

// нужен PascalCase для инициализации компонента vue
const componentPascalCase = () => {
  const camelName = componentName.replace(/-(.)/g, function(match, group1) {
    return group1.toUpperCase();
  });

  return camelName[0].toUpperCase() + camelName.slice(1);
};

const PascalName = componentPascalCase();

// внутренности js для инициализации vue
const jsInnerVue = `import Vue from 'vue';
import ${PascalName} from './${componentName}.vue';

document.addEventListener('DOMContentLoaded', () => {
${tabs}/* eslint-disable no-new */
${tabs}new Vue({
${tabs}${tabs}el     : '#${componentName}',
${tabs}${tabs}render : h => h(${PascalName}),
${tabs}});
});
`;

// создаем папку
let pathDir = dirOrganisms;

if(dir === 'm') {
  pathDir = dirMolecules;
}

if(dir === 'a') {
  pathDir = dirAtoms;
}

fs.mkdir(path.join(__dirname + pathDir, componentName), err => {
  if(err) {
    console.log('Папка уже существует. Процесс остановлен.');
    throw err;
    process.exit(1);
  }
  console.log('Папка создана');
});


// создаем файл
let files = ['json', 'twig', 'scss', 'js']; // набор для twig

if(type === 'vue') {
  files = ['vue', 'js'];

  inners.js = jsInnerVue;
}

files.forEach(file => {
  const filePath = path.join(__dirname + pathDir, componentName, filesName[file]);
  const fileStr = inners[file];

  fs.writeFile(filePath, fileStr, err => {
    if (err) {
      throw err;
    }

    console.log(`Файл ${filesName[file]} создан`);
  });
});
