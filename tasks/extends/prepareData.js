const path = require('path');
const fs = require('fs');
const sprintf = require('sprintf-js').sprintf;
const __paths = require('../../paths.config');

module.exports = function (file, innerContext, state) {
	let componentName = file;
	let templatePath;
	let componentDefaultData = {};
	let globalDefaultData = {};
	let relativePath = null;

	__paths.html.components.replace.forEach((replace) => {
		// подменяем ключевые символы на пути до специальных папок
		file = file.replace(replace[0], replace[1]);

		// очищаем путь к файлу от ключевых символов
		componentName = componentName.replace(replace[0], '');
	});

	// Берем название компонента и подставляем его в путь из настроек
	templatePath = sprintf(__paths.html.components.pattern, file, componentName);

	if (!fs.existsSync(templatePath)) {
		templatePath = sprintf(__paths.html.components.pattern, file, 'index');
	}

	if (!fs.existsSync(templatePath)) {
		templatePath = false;
	} else {
		const type = this.type;
		const token = Array.isArray(state.nestingStack) && state.nestingStack.find(stack => stack.type === type);
		const only = token.only || false;
		const withContext = token.withStack;

		// В пути к файлу заменяем расширение .twig на .json
		// Получаем из этого файла данные
		const dataFile = templatePath.replace(new RegExp(`.${__paths.html.srcExt}$`), '.json');
		if (fs.existsSync(dataFile) && !only && !withContext) {
			// noinspection JSCheckFunctionSignatures
			componentDefaultData = JSON.parse(fs.readFileSync(dataFile));
		}

		if (only) {
			const dataGlobalFile = './data/_.json';
			if (fs.existsSync(dataGlobalFile)) {
				globalDefaultData = JSON.parse(fs.readFileSync(dataGlobalFile));
			}
		}

		// Расширяем объект данными, полученными из файла.
		// Важно, что эти данные передаем в начале, так как их приоритет ниже
		innerContext = Object.assign(
			{},
			globalDefaultData,
			componentDefaultData,
			innerContext,
		);

		const filePath = path.join(__dirname, '../../', templatePath);
		const homePath = path.parse(state.template.path).dir;
		relativePath = path.relative(homePath, filePath);
	}

	return {
		file: relativePath,
		innerContext: innerContext
	};
}
