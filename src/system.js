// This file is part of Vidyamantra - http:www.vidyamantra.com/
/**@Copyright 2014  Vidyamantra Edusystems. Pvt.Ltd.
 * @author  Suman Bogati <http://www.vidyamantra.com>
  */
(
    function(window) {
        var system = {
            
            init : function (){
                this.wbRtc = {};
                this.wbRtc.className = 'webrtcCont';
                this.mybrowser = {};
                return this;
            },
            
            isCanvasSupport : function(navigator, browserName, version) {
                if (browserName == 'MSIE') {
                    if (version != 9) {
                        //TODO there should be some good method to check exisitence of canvas element in IE browsers
                        vApp.wb.error.push({'msg': vApp.lang.getString('notSupportCanvas'), 'id': 'errorCanvas', 'className': 'error'});
                    }
                } else {
                    var canvasSupported = !!window.CanvasRenderingContext2D;
                    if (!canvasSupported) {
                        vApp.wb.error.push({'msg': vApp.lang.getString('notSupportCanvas'), 'id': 'errorCanvas', 'className': 'error'});
                    }
                }
            },

            isWebRtcSupport : function(navigator, browser, version) {
                if (browser == 'Firefox') {
                    if (navigator.mozGetUserMedia) {
                        this.wbRtc.userMedia = true;
                        if (!window.mozRTCPeerConnection) {
                            vApp.wb.error.push({'msg': vApp.lang.getString('notSupportPeerConnect'), 'id': 'errorPeerConnect', 'className': 'error'});
                        } else {
                            this.wbRtc.peerCon = true;
                        }
                    } else {
                        vApp.wb.error.push({'msg': vApp.lang.getString('notSupportGetUserMedia'), 'id': 'errorGetUserMedia', 'className': 'error'});
                    }
                } else if (browser == 'Chrome' || browser == 'Safari') {
                    if (navigator.webkitGetUserMedia) {
                        this.wbRtc.userMedia = true;
                        if (!window.webkitRTCPeerConnection) {
                            vApp.wb.error.push({'msg': vApp.lang.getString('notSupportPeerConnect'), 'id': 'errorPeerConnect', 'className': 'error'});
                        } else {
                            this.wbRtc.peerCon = true;
                        }
                    } else {
                        vApp.wb.error.push({'msg': vApp.lang.getString('notSupportGetUserMedia'), 'id': 'errorGetUserMedia', 'className': 'error'});
                    }
                } else if (browser == 'MSIE' && version <= 9) {
                    vApp.wb.error.push({'msg': vApp.lang.getString('notSupportWebRtc'), 'id': 'errorWebRtc', 'className': 'error'});
                }
            },

            isWebSocketSupport : function(navigator, browser, version) {
                this.webSocket = {};
                if (typeof window.WebSocket != 'undefined' && (typeof window.WebSocket == 'function' || typeof window.WebSocket == 'object') && window.WebSocket.hasOwnProperty('OPEN')) {
                    this.webSocket = true;
                } else {
                    alert("suman bogati");
                    vApp.wb.error.push({'msg': vApp.lang.getString('notSupportWebSocket'), 'id': 'errorWebSocket', 'className': 'error'});
                }
            },

            measureResoultion : function(resolution) {
                if(typeof vcan.main.offset != 'undefined'){
                    var offset = vcan.main.offset;
                }else{
                    var element = document.getElementById('vcanvas');
                    var offset = vcan.utility.getElementOffset(element);
                }
                var offsetLeft = offset.x;
                if (resolution.width < 1024) {
                    var width = 1024 - offsetLeft;
                } else {
                    var width = resolution.width - offsetLeft;
                }
                var height = resolution.height - offset.y;
                return {'width': (width), 'height': (height)};
            },

            setCanvasDimension : function() {
                var measureRes = this.measureResoultion({'width': window.outerWidth, 'height': window.innerHeight});

                var mainWrapper =  document.getElementById('vAppCont');

                var vcanvas = document.getElementById('vcanvas');


                var  rightOffSet = vApp.wb.utility.getElementRightOffSet(vcanvas);
                console.log('rightOffSet ' + rightOffSet);

                measureRes.width = measureRes.width - rightOffSet; //60 for right edge
                //to apply top wrapper container
                mainWrapper.style.width = measureRes.width + 'px';

                measureRes.width =  Math.round(measureRes.width * (3/4));
    //            alert();
                vcanvas.style.width = measureRes.width + 'px';



                if (typeof vcan.main.canvas != 'undefined') {
                    var canvas = vcan.main.canvas;
                    ctx = vcan.main.canvas.getContext('2d');

                    canvas.width = measureRes.width;
                    canvas.height = measureRes.height
                    //this would be added for moodle clean theme.
                    // as first offset of canvas is different afte put the canvas element.
                    var element = document.getElementById('canvas');
                    var offset = vcan.utility.getElementOffset(element);
                    vcan.main.offset.x = offset.x;
                }
            },

            getResoultion : function(windowWidth) {
                var resolution = {};
                if (windowWidth < 1280) {
                    resolution.width = 1024;
                    resolution.height = 768;
                } else if (windowWidth >= 1280 && windowWidth < 1366) {
                    resolution.width = 1280;
                    resolution.height = 1024;
                } else if (windowWidth >= 1366 && windowWidth < 1920) {
                    resolution.width = 1366;
                    resolution.height = 768;
                } else if (windowWidth >= 1920) {
                    resolution.width = 1920;
                    resolution.height = 1080;
                }
                return resolution;
            },

            check : function (){
                var browser = this.mybrowser.detection();
                var browserName = browser[0];
                var browserVersion = browser[1];
                this.mybrowser.name = browserName;
                this.mybrowser.version = browserVersion;

                this.isCanvasSupport(navigator, browserName, browserVersion);
                this.isWebRtcSupport(navigator, browserName, browserVersion);
                this.isWebSocketSupport(navigator, browserName, browserVersion);
            }
        };
        
        system = system.init();
         // There could be the problem
        window.addEventListener('resize',
            function (){
                if(window.earlierWidth != window.innerWidth){
                    system.setCanvasDimension();
                }
            }
        );

        window.addEventListener('resize',
            function (){
                if(window.earlierWidth != window.innerWidth){
                    vApp.wb.view.window.resize();
                }
            }
        );

        system.mybrowser.detection = function() {
                var ua = navigator.userAgent, tem,
                        M = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*([\d\.]+)/i) || [];
                if (/trident/i.test(M[1])) {
                    tem = /\brv[ :]+(\d+(\.\d+)?)/g.exec(ua) || [];
                    return 'IE ' + (tem[1] || '');
                }
                M = M[2] ? [M[1], M[2]] : [navigator.appName, navigator.appVersion, '-?'];
                if ((tem = ua.match(/version\/([\.\d]+)/i)) != null){
                    M[2] = tem[1];
                }
                // return M.join(' ');
                return M;
            },
//        system.init = function (){
//            this.wbRtc = {};
//            this.wbRtc.className = 'webrtcCont';
//            this.mybrowser = {};
//            return this;
//        }
//        system = system.init();
//        
//        system.mybrowser.detection = function() {
//            var ua = navigator.userAgent, tem,
//                    M = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*([\d\.]+)/i) || [];
//            if (/trident/i.test(M[1])) {
//                tem = /\brv[ :]+(\d+(\.\d+)?)/g.exec(ua) || [];
//                return 'IE ' + (tem[1] || '');
//            }
//            M = M[2] ? [M[1], M[2]] : [navigator.appName, navigator.appVersion, '-?'];
//            if ((tem = ua.match(/version\/([\.\d]+)/i)) != null){
//                M[2] = tem[1];
//            }
//            // return M.join(' ');
//            return M;
//        }
//
//        system.isCanvasSupport = function(navigator, browserName, version) {
//            if (browserName == 'MSIE') {
//                if (version != 9) {
//                    //TODO there should be some good method to check exisitence of canvas element in IE browsers
//                    vApp.wb.error.push({'msg': vApp.lang.getString('notSupportCanvas'), 'id': 'errorCanvas', 'className': 'error'});
//                }
//            } else {
//                var canvasSupported = !!window.CanvasRenderingContext2D;
//                if (!canvasSupported) {
//                    vApp.wb.error.push({'msg': vApp.lang.getString('notSupportCanvas'), 'id': 'errorCanvas', 'className': 'error'});
//                }
//            }
//        }
//
//        system.isWebRtcSupport = function(navigator, browser, version) {
//            if (browser == 'Firefox') {
//                if (navigator.mozGetUserMedia) {
//                    this.wbRtc.userMedia = true;
//                    if (!window.mozRTCPeerConnection) {
//                        vApp.wb.error.push({'msg': vApp.lang.getString('notSupportPeerConnect'), 'id': 'errorPeerConnect', 'className': 'error'});
//                    } else {
//                        this.wbRtc.peerCon = true;
//                    }
//                } else {
//                    vApp.wb.error.push({'msg': vApp.lang.getString('notSupportGetUserMedia'), 'id': 'errorGetUserMedia', 'className': 'error'});
//                }
//            } else if (browser == 'Chrome' || browser == 'Safari') {
//                if (navigator.webkitGetUserMedia) {
//                    this.wbRtc.userMedia = true;
//                    if (!window.webkitRTCPeerConnection) {
//                        vApp.wb.error.push({'msg': vApp.lang.getString('notSupportPeerConnect'), 'id': 'errorPeerConnect', 'className': 'error'});
//                    } else {
//                        this.wbRtc.peerCon = true;
//                    }
//                } else {
//                    vApp.wb.error.push({'msg': vApp.lang.getString('notSupportGetUserMedia'), 'id': 'errorGetUserMedia', 'className': 'error'});
//                }
//            } else if (browser == 'MSIE' && version <= 9) {
//                vApp.wb.error.push({'msg': vApp.lang.getString('notSupportWebRtc'), 'id': 'errorWebRtc', 'className': 'error'});
//            }
//        }
//
//        system.isWebSocketSupport = function(navigator, browser, version) {
//            this.webSocket = {};
//            if (typeof window.WebSocket != 'undefined' && (typeof window.WebSocket == 'function' || typeof window.WebSocket == 'object') && window.WebSocket.hasOwnProperty('OPEN')) {
//                this.webSocket = true;
//            } else {
//                vApp.wb.error.push({'msg': vApp.lang.getString('notSupportWebSocket'), 'id': 'errorWebSocket', 'className': 'error'});
//            }
//        }
//
//        system.measureResoultion = function(resolution) {
//            if(typeof vcan.main.offset != 'undefined'){
//                var offset = vcan.main.offset;
//            }else{
//             	var element = document.getElementById('vcanvas');
//                var offset = vcan.utility.getElementOffset(element);
//            }
//            var offsetLeft = offset.x;
//            if (resolution.width < 1024) {
//                var width = 1024 - offsetLeft;
//            } else {
//                var width = resolution.width - offsetLeft;
//            }
//            var height = resolution.height - offset.y;
//            return {'width': (width), 'height': (height)};
//        }
//
//        system.setCanvasDimension = function() {
//            var measureRes = this.measureResoultion({'width': window.outerWidth, 'height': window.innerHeight});
//            
//            var mainWrapper =  document.getElementById('vAppCont');
//            
//            var vcanvas = document.getElementById('vcanvas');
//            
//            
//            var  rightOffSet = vApp.wb.utility.getElementRightOffSet(vcanvas);
//            console.log('rightOffSet ' + rightOffSet);
//            
//            measureRes.width = measureRes.width - rightOffSet; //60 for right edge
//            //to apply top wrapper container
//            mainWrapper.style.width = measureRes.width + 'px';
//
//            measureRes.width =  Math.round(measureRes.width * (3/4));
////            alert();
//            vcanvas.style.width = measureRes.width + 'px';
//            
//            
//            
//            if (typeof vcan.main.canvas != 'undefined') {
//                var canvas = vcan.main.canvas;
//                ctx = vcan.main.canvas.getContext('2d');
//
//                canvas.width = measureRes.width;
//                canvas.height = measureRes.height
//                //this would be added for moodle clean theme.
//                // as first offset of canvas is different afte put the canvas element.
//                var element = document.getElementById('canvas');
//                var offset = vcan.utility.getElementOffset(element);
//                vcan.main.offset.x = offset.x;
//            }
//        }
//
//        system.getResoultion = function(windowWidth) {
//            var resolution = {};
//            if (windowWidth < 1280) {
//                resolution.width = 1024;
//                resolution.height = 768;
//            } else if (windowWidth >= 1280 && windowWidth < 1366) {
//                resolution.width = 1280;
//                resolution.height = 1024;
//            } else if (windowWidth >= 1366 && windowWidth < 1920) {
//                resolution.width = 1366;
//                resolution.height = 768;
//            } else if (windowWidth >= 1920) {
//                resolution.width = 1920;
//                resolution.height = 1080;
//            }
//            return resolution;
//        }
//        
//        // There could be the problem
//        window.addEventListener('resize',
//            function (){
//                if(window.earlierWidth != window.innerWidth){
//                    this.setCanvasDimension();
//                }
//            }
//        );
//
//        window.addEventListener('resize',
//            function (){
//                if(window.earlierWidth != window.innerWidth){
//                    vApp.wb.view.window.resize();
//                }
//            }
//        );
//        
//        system.check = function (){
//            var browser = this.mybrowser.detection();
//            var browserName = browser[0];
//            var browserVersion = browser[1];
//            this.mybrowser.name = browserName;
//            this.mybrowser.version = browserVersion;
//
//            this.isCanvasSupport(navigator, browserName, browserVersion);
//            this.isWebRtcSupport(navigator, browserName, browserVersion);
//            this.isWebSocketSupport(navigator, browserName, browserVersion);
//        }
//            
        
        //system.check();
        
        
        window.system = system;
        
    }
)(window);