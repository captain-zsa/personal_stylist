const path = require('path');
const glob = require('glob');

module.exports = function (context) {
    glob.sync('./src/include/**/**/*.json').forEach(jsonFile => {
        context.addDependency(path.resolve(__dirname, '../', jsonFile));
    });
}
