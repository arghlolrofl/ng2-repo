/**
 * Global window scope.
 * @type {Window}
 */
const w:any = window;

/**
 * Import jQuery from global.
 */
const $ = w.$;

/**
 * Initialize Options UI.
 */
export function initOptionsUI() {
    var $showInfoButtons = $('.show-info');

    if ($showInfoButtons.length > 0) {
        $showInfoButtons.hover(function (e) {
            e.preventDefault();

            var $this = $(this);
            var targetId = $this.attr('href');
            var $target = $this.find(targetId);

            if ($target.length > 0) {
                $target.addClass('show');
            }

        }, function () {
            var $this = $(this);
            var targetId = $this.attr('href');
            var $target = $this.find(targetId);

            $target.removeClass('show');
        });
    }
}