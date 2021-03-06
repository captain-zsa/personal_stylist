# Boilerplate HTML template
Сборщик Twig, SCSS (SASS), js (es6), json

## Установка
* установите [NodeJS](https://nodejs.org/en/) (если требуется, NPM установится вместе c NodeJS)

## Запуск
```bash
npm install      # установка зависимостей
npm run "<task>" # запуск сценария
                 # <dev>, <dev:legacy>, <build>, <stats>
```
* скачайте необходимые зависимости: ```npm install```
* чтобы начать работу, введите команду: ```npm run dev``` (режим разработки, рендер страницы на лету **рекомендуемый режим**)
* чтобы начать работу, введите команду: ```npm run dev:legacy``` (режим разработки, рендер всех страниц)
* чтобы собрать проект, введите команду ```npm run build``` (режим сборки)
* чтобы анализировать зависимости проекта, введите команду ```npm run stats``` (режим анализа)

## Файловая структура

```
project-name
├── dist
├── data
├── src
│   ├── fonts
│   ├── img
│   ├── include
│   ├── js
│   ├── pages
│   ├── static
│   └── styles
├── tasks
├── webpack.config.js
├── package.json
├── .babelrc.js
├── .bemrc.js
├── .eslintrc.json
├── .stylelintrc
├── .stylelintignore
├── .editorconfig
└── .gitignore
```

* Корень папки:
    * ```.babelrc.js``` — настройки Babel
    * ```.bemrc.js``` — настройки БЭМ
    * ```.eslintrc.json``` — настройки ESLint
    * ```.gitignore``` – запрет на отслеживание файлов Git'ом
    * ```.stylelintrc``` — настройки Stylelint
    * ```.stylelintignore``` – запрет на отслеживание файлов Stylelint'ом
    * ```gulpfile.babel.js``` — настройки Gulp
    * ```webpack.config.js``` — настройки Webpack
    * ```package.json``` — список зависимостей
* Папка ```src``` - используется во время разработки:
    * БЭМ-блоки: ```src/blocks```
    * шрифты: ```src/fonts```
    * изображения: ```src/img```
    * JS-файлы: ```src/js```
    * страницы сайта: ```src/views/pages```
    * SCSS-файлы: ```src/styles```
    * HTML-файлы: ```src/views```
    * конфигурационный файл веб-сервера Apache с настройками [gzip](https://habr.com/ru/post/221849/) (сжатие без потерь): ```src/.htaccess```
* Папка ```dist``` - папка, из которой запускается локальный сервер для разработки (при запуске ```yarn run dev```)
* Папка ```gulp-tasks``` - папка с Gulp-тасками

## Работа со сборщиком
### Компоненты
Находятся в папке `src/include/@atoms/` (`src/include/^molecules/`, `src/include/&organisms`), могут содержать в себе файлы с расширениями `scss (sass) / twig / js / json`. Названия файлов должны быть либо `index`, либо должны совпадать с названием компонента (папки).

Пример компонента `button`:
```
button/
├── button.js   // скрипты
├── button.json // данные компонента
├── button.scss // стили
├── button.twig // разметка
└── button.md   // описание
```

Использование компонента ```button```:
```twig
{% view '@button' %}
или с данными
{% view '@button' with {button: {param1: 1, param2: 2}} %}
{% view '@button' with {button: button_in_footer} %}

{% view '@button' with button_in_footer %} // Это будет работать только если внутри button_in_footer есть объект 'button'. Например:
{
    ...
    "button": {
        "text": "example"
    }
    ...
}

```

* ```@``` - это алиас для компонентов в папке ```@atoms```,
* ```^``` - это алиас для компонентов в папке ```^molecules```,
* ```&``` - это алиас для компонентов в папке ```&organisms```


### JSON-данные
* Расположены в папке `data`, соответствуют названию страницы. К примеру, данные файла `data/about.json` будет подгружаться для страницы `src/pages/about.twig`
* Могут относиться к отдельным компонентам, и располагаться в папках компонентов.

### Изображения
#### Постоянные файлы
Иконки и изображения, подключаемые в стилях,
а также svg, подключаемые через `{% svg 'name' %}`, находятся в `src/img`.

Создавать отдельную папку для svg не нужно. Все иконки и так в основном являются svg.

Желательно подготоваливать все svg одних размеров (или нескольких групп размеров - 32, 56, 136).

Прогонять все svg через imageOptim (без svgo). Проверять на наличие viewBox, width, height, иначе будут ломаться в разных браузерах.

Так же лучше изменять внутри svg все fill и stroke на currentColor, чтобы менять цвет можно было стилями и одиночным свойством color.
#### Временные файлы
Изображения, видео и прочий временный контент, который подразумевает загрузку пользователем *(изображения карточек, слайдеров, фон hero и т.д.)*, должен храниться в `public/tmp`, чтобы на интеграции эту папку можно было удалить.

Папки `img` и `public` копируются в `dist`.

## Линтеры и editorconfig
В проекте есть Stylelint и ESLint. Для проверки файлов на соответствие линтеров можно использовать команду `npm run test`.

> Внимание! Модифицирование линтеров без согласования с автором запрещено (если вы не у себя в форке :)!

Код должен соответствовать ВСЕМ правилам линтеров, а также стилю в .editorconfig.

В редких случаях допускается отключать проверку ESLint. Пример – no-new для vue:
```js
/* eslint-disable no-new */
new Vue({
    el         : '#el',
    delimiters : ['${', '}'],
    mixins     : [Functional],
    store,
});
```

Если хочется писать в стиле "хайтак" и не хочется настраивать редактор – выполните после всех изменений команду `npm run test:fix`, после чего доисправляйте оставшиеся файлы.

> fix не сработает на .vue-файлах (стили не будут исправлены), поэтому нужно будет исправить стили в .vue-файлах вручную. Если найдете решение этой проблемы – пишите.

### Редакторы кода

Я пишу в VSCode, а также в phpStorm/webShtorm (всё вранье, даже этот файл пишу в sublime, но до сих пор не могу его адекватно настроить, поэтому приходится писать иногда в чем-то другом). Если у вас другой редактор – стоит найти плагины Stylelint и ESLint для него, настроить их, а также отключить стандартное автоформатирование в редакторе при сохранении (или как он там у вас форматирует сам, если умеет).

> Если у вас другой редактор и он создаёт новые файлы конфигурации – пожалуйста, не добавляйте эти файлы в репозиторий. Внесите путь к папке с этими файлами и/или сами файлы в gitignore.

#### Настройка для VSCode

Установить плагин ESLint, а также глобально установить ESLint командой `npm install -g ESLint`.
В репозитории создать файл `.vscode/settings.json`, в который записать следующее:

```json
{
    "eslint.validate": [
        "javascript",
        "vue"
    ],
    "editor.codeActionsOnSave": {
        "source.fixAll.eslint": true
    }
}
```

Далее нужно отключить автосохранение на уровне редактора. Для этого идём в `Настройки -> Параметры` ищем "Форматирование" или Format On Save и убираем галочку.

Для работы Stylelint необходимо поставить Stylelint-плагин [vscode-stylelint](https://marketplace.visualstudio.com/items?itemName=stylelint.vscode-stylelint).

Для автоисправления можно использовать плагин [stylelint-plus](https://marketplace.visualstudio.com/items?itemName=hex-ci.stylelint-plus). Параметры для корректной работы плагина **settings.json** в vscode:
```json
"stylelint.enable": true,
"stylelint.autoFixOnSave": true,
"stylelint.useLocal": true
```

#### Настройка phpStorm (и подобных)

В phpStorm по-умолчанию есть ESLint, достаточно его только включить. Переходим в `Settings/Preferences -> Languages and Frameworks -> JavaScript -> Code Quality Tools -> ESLint`. Выбираем `Automatic ESLint configuration` и отмечаем галочку `Run eslint --fix on save`.

Stylelint также установлен в phpStorm. Переходим в `Settings/Preferences -> Languages and Frameworks -> Style Sheets -> Stylelint`. Должна быть установлена галочка `Enable`, а в `Node interpreter` выбран пункт `Project`.

Автоматически редактор не умеет исправлять Stylelint, поэтому приходится лайфхачить. Самый простой метод – настроить External Tools. Переходим в `Settings/Preferences -> External Tool`, создаем новую команду, называем как удобно, в настройках проставляем:

- Program: `$ProjectFileDir$/node_modules/.bin/stylelint`
- Arguments: `$FilePath$ --fix`
- Working directory: `$ProjectFileDir$`

Далее в нужном файле нажимаем ПКМ, в меню: `External Tools -> выбираем команду` и файл отредактирован.

## Создание структуры файлов

В проекте есть файл `create.js`, который может создавать структуру файлов, если не хочется делать вручную.

> Внимание! Модифицирование файла `create.js` без согласования с автором запрещено (если вы не у себя в форке :)!

Команда `node create.js twig a test-file` создает в папке `@atoms` папку `test-file`, в ней создает структуру файлов для работы с twig-компонентом. Разберем подробно каждый флаг на примере этой команды.

1. Первый флаг (из примера выше – `twig`) – тип компонента
    - `twig` – означает, что будут созданы файлы `test-file.twig`, `test-file.scss`, `test-file.js`, `test-file.json` и в них встраивается нужная структура кода
    - `vue` – означает, что будут созданы файлы `test-file.vue`, `test-file.js` и в них встраивается нужная структура кода
2. Второй флаг (из примера выше – `m`) – расположение компонента
    - `a` – означает `@atoms`, структура файлов будет создана в папке `/src/include/@atoms`
    - `m` – означает `^molecules`, структура файлов будет создана в папке `/src/include/^molecules`
    - `o` – означает `&organisms`, структура файлов будет создана в папке `/src/include/&organisms`
3. Третий флаг (из примера выше – `test-file`) – название компонента*

> *Название компонента нужно указывать через дефис `-` _**обязательно**_. Если в названии будут большие буквы – они автоматически приводятся `toLowerCase`. Названия через дефис создает в `.js`-файле для vue код, в который подключается компонент (из примера выше – будет `@import TestFile from './test-file.vue'`). Именно для этого название _**обязательно**_ должно быть через дефис.
