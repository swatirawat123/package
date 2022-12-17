/*! The MIT License (MIT)
Copyright © 2017 Andrzej Krawczyk

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the “Software”), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE. */


(function (window) {
    
    function parse(configuration) {
        return Object.keys(configuration).map(function (key) {
            var result = {
                id: key,
                threshold: configuration[key].threshold,
                useDeviceOrientation: configuration[key].useDeviceOrientation
            };
            
            if (result["useDeviceOrientation"]) {
                result["deviceOrientation"] = configuration[key].deviceOrientation;
            }
            
            return result;
        })
    }
    
    function pickClosestThresholdID(width, configuration) {
        var index = 0;
        var len = configuration.length;
        for (var i = 0; i < len; i++) {
            if (configuration[i].threshold <= width) {
                index = i;
                continue;
            }
            
            if (configuration[i].threshold > width) {
                break;
            }
        }
        
        return configuration[index].id;
    }
    
    function sortByThreshold(thresholdsArray) {
        return thresholdsArray.sort(function compareFunction(a, b) {
            var firstThreshold = a.threshold;
            var secondThreshold = b.threshold;
            
            if (firstThreshold < secondThreshold) {
                return -1;
            }
            
            if (firstThreshold === secondThreshold) {
                return 0;
            }
            
            return 1;
        });
    }
    
    
    function LayoutChooser(semiResponsiveLayoutsConfiguration) {
        this.configuration = sortByThreshold(parse(semiResponsiveLayoutsConfiguration));
    }
    
    LayoutChooser.prototype.chooseLayout = function chooseLayout(width, isMobileDevice, isVertical, isHorizontal) {
        var isDefinedOrientation = (isVertical !== undefined || isHorizontal !== undefined)
                                    && (isVertical || isHorizontal);
        var  isOnMobile = isMobileDevice !== undefined && isMobileDevice && isDefinedOrientation;
        
        if (isOnMobile) {
            return this._findLayoutOnMobile(width, isVertical, isHorizontal);
        }
        
        
        return pickClosestThresholdID(width, this.configuration);
    };
    
    LayoutChooser.prototype._findLayoutOnMobile = function (width, isVertical, isHorizontal) {
        var compareFunc;
        if (isVertical) {
            compareFunc = function verticalFilter (el) {return el.deviceOrientation === "vertical"};
        } else if (isHorizontal) {
            compareFunc = function horizontalFilter (el) {return el.deviceOrientation === "horizontal"};
        }
        
        var filteredConfigurations = this.configuration.filter(function (element) {
            return element.useDeviceOrientation;
        }).filter(compareFunc);
        
        if (filteredConfigurations.length === 0) {
            return pickClosestThresholdID(width,  this.configuration);
        } else {
            return pickClosestThresholdID(width, filteredConfigurations);
        }
    };
    
    Object.defineProperty(LayoutChooser.prototype, 'maxThreshold', {
         get: function getMaxThreshold() {
             return this.configuration.slice(-1)[0].threshold;
         }
    });
    
    window.semiResponsive = window.semiResponsive || {};
    window.semiResponsive.LayoutChooser = window.semiResponsive.LayoutChooser || LayoutChooser;
})(window);