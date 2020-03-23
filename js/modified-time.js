/**
* Format Time 
*/
function formatTime(date){

    let hours = date.getHours() > 12 ? date.getHours() - 12 : date.getHours();
    let am_pm = date.getHours() >= 12 ? "PM" : "AM";
    hours = hours < 10 ? "0" + hours : hours;
    let minutes = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
    let currentTime12Hrs = hours + ":" + minutes + " " + am_pm;
    return currentTime12Hrs;
};

function updateTime(historicalCount){

    const dateElement = document.getElementById('date')
    const time = document.getElementById('time')

    const latestDate = historicalCount[historicalCount.length-1].create_at.split(' ')[0]
    const latestTime = historicalCount[historicalCount.length-1].create_at

    const dateFormated = (dt) => {
        mlist = [ "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ];
        return mlist[dt.getMonth()] + ' ' + dt.getDate() + ', ' + dt.getFullYear()
    };

    dateElement.innerHTML = dateFormated(new Date(latestDate))
    time.setAttribute('datetime', historicalCount[historicalCount.length-1].create_at)
    
    dateElement.innerHTML += ' '+ formatTime(new Date(latestTime));

}


