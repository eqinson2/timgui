/*global define, describe, before, after, beforeEach, afterEach, it, expect */
define([
    'timgui/Timgui'
], function (Timgui) {
    'use strict';

    describe('Timgui', function () {

        it('Sample BIT test', function () {
            expect(Timgui).not.to.be.undefined;
        });

    });

});
