const embedTag = require('./embed');
const prepareData = require('./prepareData');

module.exports = function slotTag(Twig) {
	return embedTag(Twig, {
		/**
			 * The embed tag combines the behaviour of include and extends.
			 * It allows you to include another template's contents, just like include does.
			 *
			 *  Format: {% embed "template.twig" [with {some: 'values'} only] %}
			 */
		type: 'slot',
		regex: /^slot\s+(.+?)(?:\s+(ignore missing))?(?:\s+with\s+([\S\s]+?))?(?:\s+(only))?$/,
		next: [
			'endslot'
		],

		prepareRenderData: prepareData,
	});
};

