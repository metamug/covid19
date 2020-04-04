const stateID = 14

const colors = {
    pink: {
        fill: '#d45087',
        stroke: '#a05195',
    },
    orange: {
        fill: '#ffc266',
        stroke: '#ff9900'
    },
    lightBlue: {
        fill: '#b3ecff',
        stroke: '#6fccdd',
    },
    darkBlue: {
        fill: '#92bed2',
        stroke: '#003f5c',
    },
    purple: {
        fill: '#8fa8c8',
        stroke: '#444e86',
    },
    green: {
        fill: '#70db70',
        stroke: '#008000'
    },
    red: {
        fill: '#ff3300',
        stroke: '#cc0000'
    }
};
let stateData

const displayStateInfo = (data) => {
    const nameEl = document.getElementById('state-name')
    const areaEl = document.getElementById('state-area')
    const populationEl = document.getElementById('state-population')
    const citiesEl = document.getElementById('state-cities')
    const capitalEl = document.getElementById('state-capital')
    const urbanEl = document.getElementById('state-urban')

    const { name, area, population, capital, largest_cities, urban_pop } = data.stateInfo[0]
    nameEl.innerHTML = name
    areaEl.innerHTML = area
    populationEl.innerHTML = population
    citiesEl.innerHTML = largest_cities
    capitalEl.innerHTML = capital
    urbanEl.innerHTML = urban_pop
}

const displayStateChart = () => {
    let labels = [],
    totalCuredCount=[],
    totalIndCount=[],
    totalForCount=[],
    totalDeathCount= [],
    totalConfirmedCount=[]
    fetch('https://api.metamug.com/covid/v1.0/state/'+stateID).then(res=> res.json())
        .then(data=> {
            data.stateHistory.map(obj=>{
                let createDate = moment(obj.create_at).format("MMM DD")
                labels.push(createDate)
                totalCuredCount.push(obj.cured_count)
                totalIndCount.push(obj.cnf_ind_count)
                totalForCount.push(obj.cnf_for_count)
                totalDeathCount.push(obj.death_count)
                totalConfirmedCount.push(obj.cnf_ind_count + obj.cnf_for_count)
            })
            const element = document.getElementById('state-chart-area')
            const ctx = element.getContext('2d');
            const myLineChart = new Chart(ctx, {
                type: 'line',
                data:  {
                    labels: labels,
                    datasets: [{
                        label: "Deaths",
                        fill: true,
                        backgroundColor: colors.red.fill,
                        pointBackgroundColor: colors.red.stroke,
                        borderColor: colors.red.stroke,
                        pointHighlightStroke: colors.red.stroke,
                        borderCapStyle: 'butt',
                        data: totalDeathCount,
                    },{
                        label: "Cured",
                        fill: true,
                        backgroundColor: colors.green.fill,
                        pointBackgroundColor: colors.green.stroke,
                        borderColor: colors.green.stroke,
                        pointHighlightStroke: colors.green.stroke,
                        borderCapStyle: 'butt',
                        data: totalCuredCount,
                    },{
                        label: "Total",
                        fill: true,
                        backgroundColor: colors.orange.fill,
                        pointBackgroundColor: colors.orange.stroke,
                        borderColor: colors.orange.stroke,
                        pointHighlightStroke: colors.orange.stroke,
                        borderCapStyle: 'butt',
                        data: totalConfirmedCount,
                    }]
                },
            options: {
                scales: {
                    yAxes: [{
                        stacked: true
                    }]
                }
            },
            animation: {
                duration: 750,
            },
            });
            displayStateInfo(data)
        })


}




displayStateChart()