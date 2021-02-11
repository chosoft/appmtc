const socket = io()
const colors = ['rgba(202, 254, 72,0.85)','rgba(112, 248, 186,0.85)','rgba(124, 180, 184,0.85)','rgba(87, 70, 123,0.85)','rgba(82, 73, 72,0.85)','rgba(251, 245, 243,0.85)','rgba(226, 132, 19,0.85)','rgba(196, 40, 71,0.85)','rgba(222, 60, 75,0.85)','rgba(0, 0, 34,0.85)']
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}
socket.on('mtcData', (data) => {
    let titleMtc = document.querySelector('#mtcTitle')
    let mtcValue = document.querySelector('#mtcValue')
    let repetitionsTemp = 0
    let arrayRepetition = []
    let colorsLabels = []
    titleMtc.textContent = `La MTC Elegida es La ${data.mtcType} y el valor de la ${data.mtcType} es:`
    mtcValue.textContent = `${data.mtcValue}`
    const labels = [... new Set(data.mtcValues)]

    labels.forEach(item => {
        repetitionsTemp = 0
        data.mtcValues.forEach(number => {
            if(number === item){
                repetitionsTemp += 1
            }
        })
        arrayRepetition.push(repetitionsTemp)
    })
    labels.forEach(item => {
        colorsLabels.push(colors[getRandomInt(0,colors.length-1)])
    })
    var ctx = document.getElementById('myChart').getContext('2d');
    var myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels,
            datasets: [{
                label: 'Crecimiento',
                data: arrayRepetition,
                type: 'line',
                borderColor: '#63C132',
                backgroundColor: 'rgba(0,0,0,0.0)',
                lineTension: 0.0,
            },{
                label: '# de repeticiones',
                data: arrayRepetition,
                backgroundColor: colorsLabels
            },
        ]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        }
    });
})