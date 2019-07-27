const assert = require('assert');
const Utils = require('../utils');

class Base {
    /**
     * @param {Function} parser
     */
    constructor(parser) {
        assert(typeof parser === 'function', 'parser should be function');

        this._parser = parser;
        this._before = null;
        this._after = null;
        this._point = null;
    }

    /**
     * @param {Function} func
     */
    before(func) {
        assert(typeof func === 'function', 'before should be function');

        this._before = func;

        return this;
    }

    /**
     * @param {Function} func
     */
    after(func) {
        assert(typeof func === 'function', 'after should be function');

        this._after = func;

        return this;
    }

    /**
     * @param {string} p
     */
    point(p) {
        assert(typeof p === 'string', `point should be string, now: ${p}`);
        assert(Utils.pointPattern.test(p), `invalid point(${p})`);

        this._point = p.toUpperCase();

        return this;
    }
}

module.exports = Base;
