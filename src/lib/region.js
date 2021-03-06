/*
 * Copyright (c) 2012 Francisco Salavert (ICM-CIPF)
 * Copyright (c) 2012 Ruben Sanchez (ICM-CIPF)
 * Copyright (c) 2012 Ignacio Medina (ICM-CIPF)
 *
 * This file is part of JS Common Libs.
 *
 * JS Common Libs is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 2 of the License, or
 * (at your option) any later version.
 *
 * JS Common Libs is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with JS Common Libs. If not, see <http://www.gnu.org/licenses/>.
 */

function Region(args) {

    this.chromosome = null;
    this.start = null;
    this.end = null;

    if (_.isObject(args)) {
        this.load(args);
    } else if (_.isString(args)) {
        this.parse(args);
    }
}

Region.prototype = {
    load: function (obj) {
        if (_.isString(obj)) {
            return this.parse(obj);
        }
        this.chromosome = this._checkChromosomeAlias(obj) || this.chromosome;

        if (typeof obj.position !== 'undefined') {
            obj.start = parseInt(obj.position);
            obj.end = obj.start;
        }

        (_.isUndefined(obj.start)) ? this.start = parseInt(this.start) : this.start = parseInt(obj.start);
        (_.isUndefined(obj.end)) ? this.end = parseInt(this.end) : this.end = parseInt(obj.end);
    },

    parse: function (str) {
        if (_.isObject(str)) {
            this.load(obj);
        }
        var pattern = /^([a-zA-Z0-9_])+\:([0-9])+\-([0-9])+$/;
        var pattern2 = /^([a-zA-Z0-9_])+\:([0-9])+$/;
        if (pattern.test(str) || pattern2.test(str)) {
            var splitDots = str.split(":");
            if (splitDots.length == 2) {
                var splitDash = splitDots[1].split("-");
                this.chromosome = splitDots[0];
                this.start = parseInt(splitDash[0]);
                if (splitDash.length == 2) {
                    this.end = parseInt(splitDash[1]);
                } else {
                    this.end = this.start;
                }
            }
            return true
        } else {
            return false;
        }
    },

    multiParse: function (str) {
        if (_.isObject(str)) {
            this.load(obj);
        }
        var pattern = /^([a-zA-Z0-9_])+\:([0-9])+\-([0-9])+(,([a-zA-Z0-9_])+\:([0-9])+\-([0-9])+)*$/;
        var pattern2 = /^\[([a-zA-Z0-9_])+\:([0-9])+\-([0-9])+(,([a-zA-Z0-9_])+\:([0-9])+\-([0-9])+)*\]$/;

        var withoutBrackets = str;
        if (pattern2.test(str)) {
            withoutBrackets = str.slice(1, str.length - 1);
        }

        var regions = [];
        if (pattern.test(withoutBrackets)) {
            var splitRegions = withoutBrackets.split(",");
            for (var i = 0; i < splitRegions.length; i++) {
                regions.push(new Region(splitRegions[i]));
            }
        }
        return regions;
    },

    center: function () {
        return this.start + Math.floor((this.length()) / 2);
    },

    length: function () {
        return this.end - this.start + 1;
    },

    equals: function (r) {
        if (this.chromosome === r.chromosome && this.start === r.start && this.end === r.end) {
            return true;
        }
        return false;
    },

    toString: function (formated) {
        var str;
        if (formated == true) {
            str = this.chromosome + ":" + Utils.formatNumber(this.start) + "-" + Utils.formatNumber(this.end);
        } else {
            str = this.chromosome + ":" + this.start + "-" + this.end;
        }
        return str;
    },

    _checkChromosomeAlias: function (obj) {
        for (var i = 0; i < Region.chromosomeAlias.length; i++) {
            var alias = Region.chromosomeAlias[i];
            if(alias in obj){
                return obj[alias];
            }
        }
    }
};

Region.chromosomeAlias = ['chromosome','sequenceName'];

