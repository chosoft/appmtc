const { Socket } = require('dgram')
const inquirer = require('inquirer')
const { config } = require('process')
const questions = [{type: 'rawlist',name: 'mtc', message: 'Choose one MTC',choices: ['Media','Moda','Mediana']},{type: 'confirm',name: 'chart',message: 'You need a chart of this ?'}]

async function calcMTC(){
    const config = await inquirer.prompt(questions)
    let dataMTC = []
    let dataTemp 
    let exp = /^[0-9]+$/

    do {
        dataTemp = await inquirer.prompt({type:'input',name:'value',message:'Type a value here, if you no have more press enter'})
        if(dataTemp.value === ''){
            break
        }else if(dataTemp.value.match(exp) !== null && Array.isArray(dataTemp.value.match(exp))){
            dataMTC.push(parseFloat(dataTemp.value))
        }else{
            continue
        }
    }while(dataTemp !== '')
    if(dataMTC.length <= 1 ){
        console.log('Please enter more than 2 Values')
    }else{
        switch(config.mtc){
            case 'Media':
                calcMedia(dataMTC,config.chart)
                break
            case 'Moda':
                calcModa(dataMTC,config.chart)
                break
            case 'Mediana':
                calcMediana(dataMTC,config.chart)
                break
        }
    }
}
function chartsWebs(dataChart,MTCValue,MTCType){
    const express = require('express')
    const app = express()
    const IO = require('socket.io')
    const path = require('path')
    
    app.set('views',path.join(__dirname,'views'))
    app.set('view engine', 'pug')

    app.use(express.static(path.join(__dirname,'public')))

    app.use(express.json())

    app.use('/', express.Router().get('/', (req,res) => {
        res.render('index')
    }))

    const server = app.listen(8090 || process.env.PORT, () => {
        console.log(`[SERVER] The charts are in http://localhost:${server.address().port}/`)
    })

    const io = IO(server)

    io.on('connection',(Socket) => {
        io.emit('mtcData',{mtcValue:MTCValue,mtcType:MTCType,mtcValues: dataChart})
    })
}
function calcMedia(data,chart){
    let totalSum = 0
    data.forEach(value => {
        totalSum += value
    })
    const MEDIA = (totalSum/data.length).toFixed(2)
    if(chart){
        chartsWebs(data,MEDIA,'Media')
    }else{
        console.log(`La Media de ${data} es: ${MEDIA}`)
    }
}

function calcModa(data,chart){
    let arrayClean = [... new Set(data)]
    let repetitionsArray = [];
    let modaArray = []
    let repetitionsTemp = 0

    arrayClean.forEach(item => {
        repetitionsTemp = 0
        data.forEach(number => {
            if(number === item) {
                repetitionsTemp +=1
            }
        })
        repetitionsArray.push(repetitionsTemp)
    })

    let maxNumberRepetitions = Math.max(...repetitionsArray)

    arrayClean.forEach((element,index) => {
        if(maxNumberRepetitions === repetitionsArray[index] && maxNumberRepetitions !== 1){
            modaArray.push(element)
        }
    })
    if(modaArray.length <= 0){
        if(chart){
            chartsWebs(data,'inexistente ya que no se repite ningun valor','Moda')
        }else{
            console.log(`La Moda de ${data} no existe ya que no tiene valores que se repitan`)
        }
    }else{

        if(chart){
            if(modaArray.length === arrayClean.length){
                chartsWebs(data,'inexistente ya que los valores se repiten por igual','Moda')

            }else{
                chartsWebs(data,modaArray,'Moda')
            }
        }else{
            if(modaArray.length === arrayClean.length){
                console.log(`La Moda de ${data} no existe ya que todos los valores se repiten por igual`)
            }else{
                console.log(`La Moda de ${data} es: ${modaArray}`)
            }
        }
    }


}

function calcMediana(data,chart){
    let arraySort = data.sort((a,b) => a-b)

    if(arraySort.length%2){
        let indexMiddle =  (((arraySort.length-1)/2)+1)-1
        if(chart){
            chartsWebs(data,arraySort[indexMiddle],'Mediana')
        }else{
            console.log(`La Mediana de ${data} es: ${arraySort[indexMiddle]}`)
        }
    }else{
        let middleIndex = (arraySort.length/2)-1
        const MEDIA = (arraySort[middleIndex]+arraySort[middleIndex+1])/2
        if(chart){
            chartsWebs(data,MEDIA,'Mediana')
        }else{
            console.log(`La Mediana de ${data} es: ${MEDIA}`)
        }
    }
}
calcMTC()