// Create variable with date time format for header, and display it to page.
var date = moment().format('dddd, MMMM Do');

$('#currentDay').text(date);

// Get array of saved events from storage.
var savedEvents = JSON.parse(localStorage.getItem('plannerEvents'));

// Loop over a range of integers = to the number of hours in planner.
for (i=0; i < 9; i++) {
    // Initialize the webpage with an empty array for saved events.
    if (savedEvents === null){
        savedEvents = []
    }

    // Coverts the integer to the correct hour.
    if (i <= 3){
        var hour = i + 9
    } else {
        var hour = (i + 9) % 12
    }

    // Select am or pm based on current time.
    if (i < 3){
        var ampm = "am"
    } else {
        var ampm = "pm"
    }

    // Create an element containing the html for a timeblock based on hour and am/pm logic above.

    // Note all timeblocks start with future class.
    timeBlockHtml = $(
        `
    <div class="time-block row align-items-center">
        <label class="hour col">
        ${hour}:00${ampm}
        </label>
        <div class="col-10 container row">
        <textarea class="col future" data-time="${hour}:00${ampm}" data-index="${i}"></textarea>
        </div>
        <div class="col row align-items-center">
        <button class="saveBtn col d-flex justify-content-center align-items-center" data-index="${i}">
            <i class="fa fa-save"></i>
        </button>
        </div>
    </div>
        `
    )
    
    // append the timeblock to the page.
    $('#schedule').append(timeBlockHtml)

    // Check to ensure that there is a valid saved event. If so then load that event into the textbox as text.
    if (i < savedEvents.length) {
        if (savedEvents[i] !== null) {
            $(`textarea[data-index=${i}]`).text(savedEvents[i])
        }
    }

    // Create click event for the save button on the current timeblock.
    $(`button[data-index="${i}"]`).click(function() {
        var index = $(this).attr('data-index');
        savedEvents[index] = $(this).parent().prev().children().val();
        localStorage.setItem('plannerEvents', JSON.stringify(savedEvents))
    })
}

// Function that loopos through all timeblocks giving them the correct class based on current time vs timeblock time.
function updateClasses() {
    $('textarea').each(function() {
        var timeBlock = moment( $(this).attr('data-time'), 'h:mma' )
        var currentTime = moment()

        // Changes class to past.
        if (timeBlock.hour() < currentTime.hour()) {
            $(this).removeClass('future')
            $(this).removeClass('present')
            $(this).addClass('past')
        }

        // Changes class to present
        if (timeBlock.hour() === currentTime.hour()) {
            $(this).removeClass('future')
            $(this).addClass('present')
        }
    })
}

// Initial run of updateClasses on load to get correct coloring.
updateClasses()

// Interval the updates the coloring each minute.
var updater = setInterval(updateClasses, 60000)