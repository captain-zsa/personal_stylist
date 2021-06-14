const includeTag = require('./include');
const prepareData = require('./prepareData');

module.exports = function viewTag(Twig) {
	return includeTag(Twig, {
		type: 'view',
		regex: /^view\s+(.+?)(?:\s|$)(ignore missing(?:\s|$))?(?:with\s+([\S\s]+?))?(?:\s|$)(only)?$/,

		prepareRenderData: prepareData,
	});
}
