/**
 * movie.enchant.js
 *
 * Copyright (c) 2012 Osamu Takasugi
 * Dual licensed under the MIT or GPL Version 3 licenses
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NON-INFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

(function() {
    /**
     * @scope enchant.Movie.prototype
     */
    enchant.Movie = enchant.Class.create(enchant.Node, {
        /**
         * Class to wrap audio elements.
         *
         * Safari, Chrome, Firefox, Opera, and IE all play MP3 files
         * (Firefox and Opera play via Flash). WAVE files can be played on
         * Safari, Chrome, Firefox, and Opera. When the browser is not compatible with
         * the codec the file will not fully play.
         *
         * Instances are created not via constructor but via enchant.Movie.load.
         *
         * @constructs
         */
        initialize: function() {
            enchant.Node.call(this);
            throw new Error("Illegal Constructor");

            /**
             * Sound play time (seconds).
             * @type {Number}
             */
            this.duration = 0;
        },
        /**
         * Begin playing.
         */
        play: function() {
            if (this._element) this._element.play();
        },
        /**
         * Interrupt playing.
         */
        pause: function() {
            if (this._element) this._element.pause();
        },
        /**
         * Stop playing.
         */
        stop: function() {
            this.pause();
            this.currentTime = 0;
        },
        /**
         * Current play point (seconds).
         * @type {Number}
         */
        currentTime: {
            get: function() {
                return this._element ? this._element.currentTime : 0;
            },
            set: function(time) {
                if (this._element) this._element.currentTime = time;
            }
        },
        /**
         * Volume. 0 (mute) ～ 1 (full volume).
         * @type {Number}
         */
        volume: {
            get: function() {
                return this._element ? this._element.volume : 1;
            },
            set: function(volume) {
                if (this._element) this._element.volume = volume;
            }
        }
    });

    /**
     * Load video file, create Movie object.
     *
     * @param {String} src Path of loaded audio file.
     * @param {String} [type] MIME Type of audio file.
     * @static
     */
    enchant.Movie.load = function(src) {
        var movie = Object.create(enchant.Movie.prototype);
        enchant.EventTarget.call(movie);
        var video = document.createElement('video');
        if(src instanceof Array) {
          for (var i = 0; i < src.length; ++i) {
            var srctag = document.createElement('source');
            srctag.src = src[i];
            video.appendChild(srctag);
          }
        }
        else {
          video.src = src;
        }
        video.autoplay = false;
        video.width = enchant.Core.instance.width;
        video.height = enchant.Core.instance.height;
        video.onerror = function() {
            throw new Error('Cannot load an asset: ' + movie.sources);
        };
        video.addEventListener('canplaythrough', function() {
            movie.duration = video.duration;
        }, false);
        movie._element = video;
        enchant.Core.instance._element.appendChild(video);
        return movie;
    };
})();
