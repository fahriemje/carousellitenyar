

 * @desc Specifying a speed will slow-down or speed-up the sliding speed of your carousel. Try it out with

 * different speeds like 800, 600, 1500 etc. Providing 0, will remove the slide effect.

 *

 * @option easing : string - no easing effects by default.

 * @example

 * $(".carousel").jCarouselLite({

 *      btnNext: ".next",

 *      btnPrev: ".prev",

 *      easing: "bounceout"

 * });

 * @desc You can specify any easing effect. Note: You need easing plugin for that. Once specified,

 * the carousel will slide based on the provided easing effect.

 *

 * @option vertical : boolean - default is false

 * @example

 * $(".carousel").jCarouselLite({

 *      btnNext: ".next",

 *      btnPrev: ".prev",

 *      vertical: true

 * });

 * @desc Determines the direction of the carousel. true, means the carousel will display vertically. The next and

 * prev buttons will slide the items vertically as well. The default is false, which means that the carousel will

 * display horizontally. The next and prev items will slide the items from left-right in this case.

 *

 * @option circular : boolean - default is true

 * @example

 * $(".carousel").jCarouselLite({

 *      btnNext: ".next",

 *      btnPrev: ".prev",

 *      circular: false

 * });

 * @desc Setting it to true enables circular navigation. This means, if you click "next" after you reach the last

 * element, you will automatically slide to the first element and vice versa. If you set circular to false, then

 * if you click on the "next" button after you reach the last element, you will stay in the last element itself

 * and similarly for "previous" button and first element.

 *

 * @option visible : number - default is 3

 * @example

 * $(".carousel").jCarouselLite({

 *      btnNext: ".next",

 *      btnPrev: ".prev",

 *      visible: 4

 * });

 * @desc This specifies the number of items visible at all times within the carousel. The default is 3.

 * You are even free to experiment with real numbers. Eg: "3.5" will have 3 items fully visible and the

 * last item half visible. This gives you the effect of showing the user that there are more images to the right.

 *

 * @option start : number - default is 0

 * @example

 * $(".carousel").jCarouselLite({

 *      btnNext: ".next",

 *      btnPrev: ".prev",

 *      start: 2

 * });

 * @desc You can specify from which item the carousel should start. Remember, the first item in the carousel

 * has a start of 0, and so on.

 *

 * @option scrool : number - default is 1

 * @example

 * $(".carousel").jCarouselLite({

 *      btnNext: ".next",

 *      btnPrev: ".prev",

 *      scroll: 2

 * });

 * @desc The number of items that should scroll/slide when you click the next/prev navigation buttons. By

 * default, only one item is scrolled, but you may set it to any number. Eg: setting it to "2" will scroll

 * 2 items when you click the next or previous buttons.

 *

 * @option beforeStart, afterEnd : function - callbacks

 * @example

 * $(".carousel").jCarouselLite({

 *      btnNext: ".next",

 *      btnPrev: ".prev",

 *      beforeStart: function(a) {

 *          alert("Before animation starts:" + a);

 *      },

 *      afterEnd: function(a) {

 *          alert("After animation ends:" + a);

 *      }

 * });

 * @desc If you wanted to do some logic in your page before the slide starts and after the slide ends, you can

 * register these 2 callbacks. The functions will be passed an argument that represents an array of elements that

 * are visible at the time of callback.

 *

 *

 * @cat Plugins/Image Gallery

 * @author Ganeshji Marwaha/ganeshread@gmail.com

 */

(function ($) { // Compliant with jquery.noConflict()

    $.fn.jCarouselLite = function (o) {



        o = $.extend({          // Default options, these get overwritten is an object is passed to constructor

            btnPrev: null,

            btnNext: null,

            btnGo: null,

            mouseWheel: false,

            auto: null,

            speed: 200,

            easing: null,

            vertical: false,

            circular: true,

            visible: 3,

            start: 0,

            scroll: 1,

            beforeStart: null,

            afterEnd: null

        }, o || {});



        return this.each(function () { // Returns the element collection. Chainable.



            var running = false,

                animCss = o.vertical ? "top" : "left",

                sizeCss = o.vertical ? "height" : "width",

                sizeAlt = o.vertical ? "width" : "height",

                c = $(this),        // main carousel element

                ul = $("ul", c),

                tLi = $("li", ul),  // LI tags

                numOriginalItems = tLi.size(),    // num li tags

                numVisible = o.visible,      // num li tags visible at a time

                timer;



            if (o.circular) {

                ul.prepend(tLi.slice(numOriginalItems - numVisible).clone())     // prepend last LI to list

                  .append(tLi.slice(0, numVisible).clone());             // append first LI to list

                o.start += numVisible;

            }



            tLi = $("li", ul);      // get LIs again (including ones we just added)

            var numItems = tLi.size();



            //var f = $("li", ul),

            var curr = o.start;

            c.css("visibility", "visible");

            tLi.css({

                overflow: "hidden",

                float: o.vertical ? "none" : "left"

            });

            ul.css({

                margin: "0",

                padding: "0",

                position: "relative",

                "list-style-type": "none",

                "z-index": "1"

            });

            c.css({

                overflow: "hidden",

                position: "relative",

                "z-index": "2",

                left: "0px"

            });

            var mW = 0,     // width of widest LI

                mH = 0;     // height of highest LI

            tLi.each(function () {

                var s = $(this);

                mW = Math.max(mW, s.width());

                mH = Math.max(mH, s.height());

            });

            var liWidth = o.vertical ? mH : mW,	    	// Full li size (incl margin) - Used for animation

                visibleWidth = liWidth * numVisible,				// Visible width of UL		

                ulWidthFull = liWidth * numItems;       // size of full ul (total length, not just for the visible items)

            console.log('setting width', tLi)

            tLi.css({

                width: mW /*,

                height: mH*/

            });

            ul.css(sizeCss, ulWidthFull + "px").css(animCss, -(curr * liWidth));

            c.css(sizeCss, visibleWidth + "px");

            c.css(sizeAlt, (o.vertical ? mW : mH) + 'px');



            // Previous button action

            if (o.btnPrev) c.parent().find(o.btnPrev).click(function () {

                return go(curr - o.scroll)

            });



            // Next button action

            if (o.btnNext) c.parent().find(o.btnNext).click(function () {

                return go(curr + o.scroll)

            });



            // Play/Go button action

            if (o.btnGo) $.each(o.btnGo, function (i, a) {

                $(a).click(function () {

                    return go(o.circular ? o.visible + i : i)

                })

            });



            // Mousewheel support

            if (o.mouseWheel && c.mousewheel) c.mousewheel(function (e, d) {

                return d > 0 ? go(curr - o.scroll) : go(curr + o.scroll)

            });



            // Listen for event, sets auto-scrolling to true/false

            c.bind('changeAuto', function (e, a) {

                if (timer) clearInterval(timer);

                if (a) {

                    o.auto = a;

                    timer = setInterval(function () {

                        go(curr + o.scroll)

                    }, o.auto + o.speed)

                }

            });



            if (o.auto) c.trigger('changeAuto', [o.auto]);


         
      
      //------------------------------------------------------------------------------
            // Special fix for Crown website
            //
            // Fluidly-sized images (ie. 100% width) don't work properly with the carousel
            // cos JS can't determine height till image has begun to load
            
            function fix() {
                console.log('running fix',tLi.height())
                tLi.css('height', '');
                var nH = tLi.height();
                c.height(nH-1);
            }

            fix();                          // run fix immediately
            tLi.find('img').load(fix);      // run fix again after each image has loaded
            $(document).load(fix);          // run fix again when all images have loaded


            // resize image carousel when browser orientation changes (or window resizes)
            $(window).bind("orientationchange resize", function(e) {

                // For each carousel on the page...
                //$('.carouselActive').each( function() {

                    //var c = $(this);
                    //var lis = c.find('li');
                    //console.log('resizing')
                    //var numItems = lis.length;
                    // resize LI tags to full-width of screen
                    var winWidth = c.width('100%').width();       // minus 20px margin on each side
                    console.log(winWidth);

                    liWidth = winWidth;

                    tLi.width(winWidth);
                    //c.find('ul')
                    ul.width(winWidth * numItems)
                      .css('left', -(curr * liWidth));
                    // .css('left','0px');
                    //c.width(winWidth)
                    c.height(maxHeight(tLi));
                    
                    //go(curr);
                //});
                fix();

            });


            //------------------------------------------------------------------------------



            // return visible LI tags
            function vis() {
                return tLi.slice(curr).slice(0, numVisible)      
            };

            // Do the scrolling thing...
            function go(itemIndex) {
                if (running) { return false }

                if (o.beforeStart) o.beforeStart.call(this, vis());

                // Do circular wrap-around magic if necessary
                if (o.circular) {
                    if (itemIndex <= o.start - numVisible - 1) {
                        ul.css(animCss, -((numItems - (numVisible * 2)) * liWidth) + "px");
                        curr = itemIndex == o.start - numVisible - 1 ? numItems - (numVisible * 2) - 1 : numItems - (numVisible * 2) - o.scroll
                    } else if (itemIndex >= numItems - numVisible + 1) {
                        ul.css(animCss, -((numVisible) * liWidth) + "px");
                        curr = itemIndex == numItems - numVisible + 1 ? numVisible + 1 : numVisible + o.scroll
                    } else curr = itemIndex
                } else {
                    if (itemIndex < 0 || itemIndex > numItems - numVisible) return;
                    else curr = itemIndex
                }

                running = true;
                ul.animate(animCss == "left" ? {
                        left: -(curr * liWidth)
                    } : {
                        top: -(curr * liWidth)
                    }, o.speed, o.easing, function () {
                        if (o.afterEnd) o.afterEnd.call(this, vis());
                        running = false
                });

                // Disable buttons when the carousel reaches the last/first, and enable when not
                if (!o.circular) {
                    c.parent().find(o.btnPrev + ',' + o.btnNext).removeClass("disabled");
                    $((curr - o.scroll < 0 && o.btnPrev) || (curr + o.scroll > numItems - numVisible && o.btnNext) || [], c.parent()).addClass("disabled")
                }
                
                return false;
            };

            // Listen for event (parameter = number of )
            c.bind('slideGo', function (e, numToScroll) {
                go(curr + numToScroll)
            });

            c.bind('slideGoTo', function (e, s) {
                go(s.index())
            });
        });
    };

    function css(el, prop) {
        return parseInt($.css(el[0], prop)) || 0;
    };

    function width(el) {
        return el[0].offsetWidth + css(el, 'marginLeft') + css(el, 'marginRight');
    };

    function height(el) {
        return el[0].offsetHeight + css(el, 'marginTop') + css(el, 'marginBottom');
    };

    function maxHeight(jqItems) {
        //console.log(jqItems);
        var num = jqItems.size();
        var mh = jqItems.eq(0).height();
        for (var i=1; i<num; i++) { mh = Math.max(mh, jqItems.eq(i).height()) }
        return mh;
    }

})(jQuery);