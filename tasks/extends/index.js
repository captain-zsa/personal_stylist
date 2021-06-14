module.exports = (Twig) => {
	Twig.exports.extendTag(require('./view')(Twig));
	Twig.exports.extendTag(require('./svg')(Twig));
	Twig.exports.extendTag(require('./slot')(Twig));
	Twig.exports.extendTag(require('./endslot'));
}
