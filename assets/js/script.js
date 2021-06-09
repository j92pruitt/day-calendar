var date = moment().format('dddd, MMMM Do');

$('#currentDay').text(date);

var savedEvents = JSON.parse(localStorage.getItem('plannerEvents'));

for (i=0; i < 12; i++) {
    if (savedEvents === null){
        savedEvents = []
    }

    if (i <= 3){
        var hour = i + 9
    } else {
        var hour = (i + 9) % 12
    }

    if (i < 3){
        var ampm = "am"
    } else {
        var ampm = "pm"
    }

    test = $(
        `
    <div class="time-block row align-items-center">
        <label class="hour col">
        ${hour}:00${ampm}
        </label>
        <div class="col-10 container row">
        <textarea class="col future" data-time="${hour}:00${ampm}"></textarea>
        </div>
        <div class="col row align-items-center">
        <button class="saveBtn col d-flex justify-content-center align-items-center" data-index="${i}">
            <i class="fa fa-save"></i>
        </button>
        </div>
    </div>
        `
    )

    $('#schedule').append(test)

    $(`button[data-index="${i}"]`).click(function() {
        var index = $(this).attr('data-index');
        savedEvents[index] = $(this).parent().prev().children().val();
        localStorage.setItem('plannerEvents', JSON.stringify(savedEvents))
    })
}

function updateClasses() {
    $('textarea').each(function() {
        var timeBlock = moment( $(this).attr('data-time'), 'h:mma' )
        var currentTime = moment()

        if (timeBlock.hour() < currentTime.hour()) {
            $(this).removeClass('future')
            $(this).removeClass('present')
            $(this).addClass('past')
        }

        if (timeBlock.hour() === currentTime.hour()) {
            $(this).removeClass('future')
            $(this).addClass('present')
        }
    })
}

updateClasses()

var updater = setInterval(updateClasses, 60000)