var $items = $('.scroll-items img');

$('.next').on('click', function () {
        var current = $items.filter('[data-state="current"]').index();
        var next = current + 1;

        if (next >= $items.length) {
                next = 0;
        }

        $items.eq(next).attr('data-state', 'incoming').css('left', '100%').animate({
                        left: 0
                },
                250,
                function () {
                        $items.eq(next).attr('data-state', 'current');
                }
        );

        $items.eq(current).animate({
                        left: $items.eq(current).width() * -1
                },
                250,
                function () {
                        $items.eq(current).attr('data-state', '');
                }
        );
});

$('.prev').on('click', function () {
        var current = $items.filter('[data-state="current"]').index();
        var prev = current - 1;

        if (prev < 0) {
                prev = $items.length - 1;
        }

        $items.eq(prev).attr('data-state', 'incoming').css('left', $items.eq(current).width() * -1).animate({
                        left: 0
                },
                250,
                function () {
                        $items.eq(prev).attr('data-state', 'current');
                }
        );

        $items.eq(current).animate({
                        left: $items.eq(current).width()
                },
                250,
                function () {
                        $items.eq(current).attr('data-state', '');
                }
        );
});