const stateCodes = {
    "AN":"Andaman and Nicobar Islands",
    "AP":"Andhra Pradesh",
    "AR":"Arunachal Pradesh",
    "AS":"Assam",
    "BR":"Bihar",
    "CG":"Chandigarh",
    "CT":"Chhattisgarh",
    "DN":"Dadra and Nagar Haveli",
    "DD":"Daman and Diu",
    "DL":"Delhi",
    "GA":"Goa",
    "GJ":"Gujarat",
    "HR":"Haryana",
    "HP":"Himachal Pradesh",
    "JK":"Jammu and Kashmir",
    "JH":"Jharkhand",
    "KA":"Karnataka",
    "KL":"Kerala",
    "LA":"Ladakh",
    "LD":"Lakshadweep",
    "MP":"Madhya Pradesh",
    "MH":"Maharashtra",
    "MN":"Manipur",
    "ML":"Meghalaya",
    "MZ":"Mizoram",
    "NL":"Nagaland",
    "OD":"Odisha",
    "PY":"Puducherry",
    "PB":"Punjab",
    "RJ":"Rajasthan",
    "SK":"Sikkim",
    "TN":"Tamil Nadu",
    "TS":"Telangana",
    "TR":"Tripura",
    "UP":"Uttar Pradesh",
    "UK":"Uttarakhand",
    "WB":"West Bengal"
}

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


let historicalCount
let labels=[],
    totalCuredCount=[],
    totalIndCount=[],
    totalForCount=[],
    totalDeathCount= [],
    totalConfirmedCount=[]
//Cases count
const cnfCount = document.getElementById('cnf_count')
const deathCount = document.getElementById('death_count')
const curedCount = document.getElementById('cured_count')
const totalCount = document.getElementById('total_count')
const percentTotal = document.getElementById('percent-total')
const percentDeath = document.getElementById('percent-death')
const percentCured = document.getElementById('percent-cured')

const fetchData = async () => {

await fetch("https://api.metamug.com/covid/v1.0/india")
        .then(res=> res.json()).then(data=> {
            historicalCount = data.historical_count
            updateTime(historicalCount);
            historicalCount.map(obj=> {
                labels.push(obj.create_at.split(' '))
                totalCuredCount.push(obj.total_cured_count)
                totalIndCount.push(obj.total_ind_count)
                totalForCount.push(obj.total_for_count)
                totalDeathCount.push(obj.total_death_count)
                totalConfirmedCount.push(obj.total_ind_count + obj.total_for_count)
            })

            const percentIncrease = (current, previous) => {
                let ratio = parseInt(previous) /parseInt(current)
                return Math.round((1 - ratio)*100)
            }

            let currentObj = historicalCount[historicalCount.length-1]
            let prevObj = historicalCount[historicalCount.length-2]

            if(historicalCount) {
                const {total_for_count, total_ind_count, total_death_count, total_cured_count} =  historicalCount[historicalCount.length-1]
                cnfCount.innerHTML = total_for_count + total_ind_count
                totalCount.innerHTML = total_for_count + total_ind_count
                deathCount.innerHTML = total_death_count
                curedCount.innerHTML = total_cured_count
                percentTotal.innerHTML = ' ⬆' + percentIncrease(totalConfirmedCount[totalConfirmedCount.length-1], totalConfirmedCount[totalConfirmedCount.length-2])+ '%'
                percentDeath.innerHTML = ' ⬆' + percentIncrease(currentObj.total_death_count, prevObj.total_death_count)+ '%'
                percentCured.innerHTML = ' ⬆' + percentIncrease(currentObj.total_cured_count, prevObj.total_cured_count)+ '%'
            }

            const getStateCode = (value) => {
                return Object.keys(stateCodes).find(key=> stateCodes[key] === value)
            }

            const findMin = () => {
                const initial = data.statewise_latest[0].cnf_for_count + data.statewise_latest[0].cnf_ind_count
                return data.statewise_latest.reduce((min, obj) => {
                        const current = obj.cnf_for_count + obj.cnf_ind_count
                        return current < min ? current : min
                    }, initial)
            }

            const findMax = () => {
                const initial = data.statewise_latest[0].cnf_for_count + data.statewise_latest[0].cnf_ind_count
                return data.statewise_latest.reduce((min, obj) => {
                        const current = obj.cnf_for_count + obj.cnf_ind_count
                        return current > min ? current : min
                    }, initial)
            }

            const minCount = findMin() +1
            const maxCount = findMax()

            const decideShade = (count) => {
                const diff = maxCount - minCount
                const step = Math.ceil(diff/10)
                //Divide each totalCount with this step to choose shade
                const shadeNo = Math.ceil(count/step)
                if (count === maxCount) {
                    return "shade-max"
                }
                return "shade-"+shadeNo
            }

            let dataForTooltip = []

            data.statewise_latest.map((obj) => {
                const { name, cnf_ind_count, cnf_for_count, death_count, id, cured_count} = obj
                const totalCount = cnf_for_count + cnf_ind_count
                const code = getStateCode(name)
                let tempObject = {}
                tempObject[code] = {
                    total: totalCount
                }
                dataForTooltip.push(tempObject)
            })

            // FOR SCALING
            // const vw = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
            // const vh = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
            let scaleFactor, translateFactor
            window.mobilecheck = function() {
            let check = false;
            (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
            return check;
            };
            if(mobilecheck()){
                scaleFactor = 580
                translateFactor = 2.5
            } else {
                scaleFactor = 1000
                translateFactor = 2
            }
        // MAP
        const map = new Datamap({
        element: document.getElementById('india'),
        scope: 'india',
        // data: {...dataForTooltip},
        geographyConfig: {
            popupOnHover: true,
            highlightOnHover: true,
            borderColor: '#444',
            borderWidth: 0.5,
            dataUrl: '/js/india.topo.json',
            popupTemplate: function(geo, data) {
                if (!data) return;
                return ['<div class="hoverinfo"><strong>',
                     geo.properties.name,
                    '</strong>',
                    '<br><strong>Total: ', data.total, '</strong>',
                    '<br><strong>Deaths: ', data.deaths, '</strong>',
                    '<br><strong>Cured: ', data.cured, '</strong></div>'
                ].join('');
            }
            //dataJson: topoJsonData
        },
        fills: {
            'shade-0': '#ffebe6',
            'shade-1': '#ffd6cc',
            'shade-2': '#ffc2b3',
            'shade-3': '#ffad99',
            'shade-4': '#ff9980',
            'shade-5': '#ff8566',
            'shade-6': '#ff704d',
            'shade-7': '#ff5c33',
            'shade-8': '#ff471a',
            'shade-9': '#ff3300',
            "shade-max": "#e62e00",
            "shade-min": "#ffeeea",
            defaultFill: '#fff'
        },
        setProjection: function (element) {
            var projection = d3.geo.mercator()
                .center([78.9629, 23.5937]) // always in [East Latitude, North Longitude]
                .scale(scaleFactor)
                .translate([element.offsetWidth/translateFactor, element.offsetHeight / translateFactor]);;
            var path = d3.geo.path().projection(projection);
            return { path: path, projection: projection };
        },
        });

            data.statewise_latest.map((obj) => {
                const { name, cnf_ind_count, cnf_for_count, death_count, id, cured_count} = obj
                const totalCount = cnf_for_count + cnf_ind_count
                // console.log(totalCount)
                let stateCode = getStateCode(name)
                let tempObject = {}
                tempObject[stateCode] = {
                    fillKey: decideShade(totalCount),
                    total: totalCount,
                    deaths: death_count,
                    cured: cured_count
                }
                map.updateChoropleth(tempObject)
            })


            const ctx = document.getElementById('myChart').getContext('2d');
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
        })
    }

fetchData()
