

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