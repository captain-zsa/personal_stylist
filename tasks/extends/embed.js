/**
* Исходный код тега {% embed %},
* расширен дополнительной обработкой пути файла и передаваемых данных
*
* @see Twig.logic.definitions
* @param Twig
* @param params
*/
module.exports = function embedTag(Twig, params) {
	return {
		/**
		 * The embed tag combines the behaviour of include and extends.
		 * It allows you to include another template's contents, just like include does.
		 *
		 *  Format: {% embed "template.twig" [with {some: 'values'} only] %}
		 */
		type: params.type,
		regex: params.regex,
		next: params.next,
		open: true,
		compile(token) {
			const { match } = token;
			const expression = match[1].trim();

			/* edited */
			const ignoreMissing = true;
			/* end */

			const withContext = match[3];
			const only = ((match[4] !== undefined) && match[4].length);

			delete token.match;

			token.only = only;
			token.ignoreMissing = ignoreMissing;

			token.stack = Twig.expression.compile.call(this, {
				type: Twig.expression.type.expression,
				value: expression
			}).stack;

			if (withContext !== undefined) {
				token.withStack = Twig.expression.compile.call(this, {
					type: Twig.expression.type.expression,
					value: withContext.trim()
				}).stack;
			}

			return token;
		},
		parse(token, context, chain) {
			let embedContext = {};
			let promise = Twig.Promise.resolve();
			let state = this;

			if (!token.only) {
				embedContext = { ...context };
			}

			if (token.withStack !== undefined) {
				promise = Twig.expression.parseAsync.call(state, token.withStack, context).then(withContext => {
					embedContext = { ...embedContext, ...withContext };
				});
			}

			return promise
				.then(() => {
					return Twig.expression.parseAsync.call(state, token.stack, embedContext);
				})
				.then(fileName => {
					const embedOverrideTemplate = new Twig.Template({
						data: token.output,
						id: state.template.id,
						base: state.template.base,
						path: state.template.path,
						url: state.template.url,
						name: state.template.name,
						method: state.template.method,
						options: state.template.options
					});

					try {
						/**
						 * Внедряем сюда кастомную логику: добавляем коллбэк,
						 * который готовит путь к файлу и данные (получает их из JSON и т.д.)
						 */
						params.prepareRenderData = params.prepareRenderData || false;
						if (typeof params.prepareRenderData === 'function') {
							const renderData = params.prepareRenderData(fileName, embedContext, state) || {};

							fileName = renderData.hasOwnProperty('file') && renderData.file
								? renderData.file
								: file;

							embedContext = renderData.hasOwnProperty('innerContext')
								? renderData.innerContext
								: embedContext;
						}
						/* end */

						embedOverrideTemplate.importFile(fileName);
					} catch (error) {
						if (token.ignoreMissing) {
							return '';
						}

						// Errors preserve references to variables in scope,
						// this removes `this` from the scope.
						state = null;

						throw error;
					}

					embedOverrideTemplate.parentTemplate = fileName;

					return embedOverrideTemplate.renderAsync(
						embedContext,
						{
							isInclude: true
						}
					);
				})
				.then(output => {
					return {
						chain,
						output
					};
				});
		}
	};
};
