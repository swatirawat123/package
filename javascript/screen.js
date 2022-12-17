/*! The MIT License (MIT)
Copyright © 2017 Andrzej Krawczyk

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the “Software”), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE. */


(function (window) {
    var isSamsungBrowserRegExp = new RegExp('SamsungBrowser', 'gi');
    var currentScreenSizes;
    
    function getSizesStruct(width, height, orientation) {
        if (!orientation) {
            orientation = ScreenUtils.ORIENTATION_TYPES.NOT_MOBILE;
        }
        
        return {
            "height": height,
            "width": width,
            "orientation": orientation
        };
    }

    function portraitScreenSizes(screenWidth, screenHeight) {
        return {
            width: Math.min(screenWidth, screenHeight),
            height: Math.max(screenWidth, screenHeight)
        };
    }
    
    function landscapeScreenSizes(screenWidth, screenHeight) {
        return {
            width: Math.max(screenWidth, screenHeight),
            height: Math.min(screenWidth, screenHeight)
        };
    }
    
    function ScreenUtils () {}
    
    ScreenUtils.isMobileUserAgent = function (userAgent) {
        if (userAgent === undefined || !userAgent) {
            return false;
        }
        
        var mobile_agent = userAgent.match(/Android/i) ||
          userAgent.match(/BlackBerry/i) ||
          userAgent.match(/iPhone|iPad|iPod/i) ||
          userAgent.match(/IEMobile/i) ||
          userAgent.match(/Opera Mini/i);
        
        if (mobile_agent) {
            return true;
        } else {
            return false;
        }
    };
    
    ScreenUtils.isSamsungBrowser = function (userAgent) {
        if (userAgent === undefined || !userAgent) {
            return false;
        }
        
        return isSamsungBrowserRegExp.test(userAgent);
    };
    
    ScreenUtils.ORIENTATION_TYPES = {};
    ScreenUtils.ORIENTATION_TYPES.NOT_MOBILE = "NOT_MOBILE";
    ScreenUtils.ORIENTATION_TYPES.PORTRAIT = "PORTRAIT";
    ScreenUtils.ORIENTATION_TYPES.LANDSCAPE = "LANDSCAPE";
    
    ScreenUtils.orientationType = function () {
        var isAndroid = /(android)/i.test(navigator.userAgent);
        if (isAndroid) {
            if(window.innerWidth > window.innerHeight){
                return ScreenUtils.ORIENTATION_TYPES.LANDSCAPE;
           } else {
                return ScreenUtils.ORIENTATION_TYPES.PORTRAIT;
           }
        } else {
            if(window.orientation == 0 || window.orientation == 180) {
                //portrait mode iOS and other devices
                return ScreenUtils.ORIENTATION_TYPES.PORTRAIT;
            } else {
                return ScreenUtils.ORIENTATION_TYPES.LANDSCAPE;
            }
        }
    };
    
    ScreenUtils.getScreenSizesDependingOnOrientation = function (userAgent, orientationTypes) {
        var orientationData = orientationTypes || getOrientation(userAgent);
        
        if (orientationData.isMobile && orientationData.isPortrait) {
            var screenSizes = portraitScreenSizes(window.screen.width, window.screen.height);
            return getSizesStruct(screenSizes.width, screenSizes.height, orientationData.screenOrientation);
        } else if (orientationData.isMobile && orientationData.isLandscape) {
            var screenSizes = landscapeScreenSizes(window.screen.width, window.screen.height);
            return getSizesStruct(screenSizes.width, screenSizes.height, orientationData.screenOrientation);
        }
        
        return getSizesStruct($(window).width(), $(window).height());
    };
    
    ScreenUtils.getViewPortAndIframeSizes = function (iframeContentWidth, iframeContentHeight, userAgent) {
        var viewPortWidth = iframeContentWidth;
        var viewPortHeight = iframeContentHeight;
        var orientationTypes = getOrientation(userAgent);

        if (orientationTypes.isMobile) {
            var screenSizes = window.mAuthor.ScreenUtils.getScreenSizesDependingOnOrientation(userAgent, orientationTypes);
            var ratio = screenSizes.width / iframeContentWidth;
            var heightRatio = ratio * iframeContentHeight;
            
            if (heightRatio < screenSizes.height) {
                viewPortWidth = iframeContentWidth;
                viewPortHeight = "device-height";
            } else if (heightRatio === screenSizes.height) {
                viewPortWidth = iframeContentWidth;
                viewPortHeight = iframeContentHeight;
            } else if (heightRatio > screenSizes.height) {
                viewPortWidth = iframeContentWidth;
                viewPortHeight = iframeContentHeight;
            }
        }
        
        return {
            iframeWidth: iframeContentWidth,
            iframeHeight: iframeContentHeight,
            viewPortWidth: viewPortWidth,
            viewPortHeight: viewPortHeight
        };
    };
    
    function getOrientation(userAgent) {
        var screenOrientation = ScreenUtils.orientationType();
        return {
            isMobile: ScreenUtils.isMobileUserAgent(userAgent),
            screenOrientation: screenOrientation,
            isPortrait: screenOrientation === ScreenUtils.ORIENTATION_TYPES.PORTRAIT,
            isLandscape: screenOrientation === ScreenUtils.ORIENTATION_TYPES.LANDSCAPE
        };
    }

    // This method needs to be run on pageload
    // in order to initialize currentScreenSizes value
    ScreenUtils.isSoftKeyboardResize = function() {
        var width = window.screen.width;
        var height = window.screen.height;

        if (currentScreenSizes === undefined){
            currentScreenSizes = {width:width, height:height};
            return false;
        }

        if (math.abs(currentScreenSizes.width - width) > currentScreenSizes.width / 20) {
            currentScreenSizes = {width:width, height:height};
            return false;
        }

        if (math.abs(currentScreenSizes.height - height) > currentScreenSizes.height / 20) {
            currentScreenSizes = {width:width, height:height};
            return false;
        }

        currentScreenSizes = {width:width, height:height};
        return true;
    };
    
    window.mAuthor = window.mAuthor || {};
    window.mAuthor.ScreenUtils = window.mAuthor.ScreenUtils || ScreenUtils;
})(window);
