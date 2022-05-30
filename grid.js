const gridContainer = document.getElementById("grid-container")
const grid = []
const proxyGrid = []
let gridSize = 3
let dividedCount = 0
let score = 0
let dividers = []
var dropAddress
create2DArray(gridSize)

document.getElementById("score").innerHTML = score

for(x=0 ;x< gridSize; x++ ){
    for(y = 0 ; y < gridSize ; y++ ){
        grid[x][y] = null
        let field = document.createElement("DIV")
        field.addEventListener("dragover", e => {e.preventDefault()})
        field.id = `${x}${y}`
        field.className = "field"
        gridContainer.append(field)
        document.getElementById(`${x}${y}`).addEventListener("drop", event => {
            console.log(event.target.id)
           dropAddress = event.target.id
        })
    }   
}

var input = function(address , num){   
    
    console.log(address)
    grid[address[0]][address[1]] = parseInt(num)
    document.getElementById(`${address}`).innerHTML = num.toString()
    document.getElementById(address).className = "filled"
    refresh(grid)  
}

function refresh(realgrid){ 
    dropAddress = null
    // check if number is divisible by neighbouring numbers
    for(x=0 ; x < gridSize; x++){
        for(y=0 ; y < gridSize ; y++){
            let checkarr = [false , false , false , false]
            try{
                 if((realgrid[x][y] / realgrid[x-1][y]) % 1 == 0){
                    checkarr[0] =realgrid[x-1][y]
                 }
            }catch{
                checkarr[0] = false
            }
            try{
                if((realgrid[x][y] / realgrid[x][y+1]) % 1 == 0){
                   checkarr[1] =realgrid[x][y+1]
                }
           }catch{
               checkarr[1]= false
           }
           try{
            if((realgrid[x][y] / realgrid[x+1][y]) % 1 == 0){
               checkarr[2] =realgrid[x+1][y]
            }
            }catch{
                checkarr[2] = false
            }
            try{
                if((realgrid[x][y] / realgrid[x][y-1]) % 1 == 0){
                   checkarr[3] =realgrid[x][y-1]
                }
           }catch{
               checkarr[3] = false
           }
           //get the lowest result of division by the neighbouring number
           if(realgrid[x][y] / Math.max(...checkarr) < Infinity && realgrid[x][y] / Math.max(...checkarr) >0){
            proxyGrid[x][y] = realgrid[x][y] / Math.max(...checkarr)
           }else{
               proxyGrid[x][y] = 0
           }
           //get all combinations of the neighbouring numbers
           const getAllSubsets =
                theArray => theArray.reduce(
                    (subsets, value) => subsets.concat(
                    subsets.map(set => [value, ...set])
                    ),
                    [[]]
                )
            const subs = {...getAllSubsets(checkarr)}
        //check if there is an alternate combination of divisions that yields a result         
           for(let i = 0 ;  i < 16 ; i++){ 
               
               
                try{
                    
                if(subs[i].length > 1 && subs[i].reduce((a, b) => a*b) == grid[x][y]){
                    
                    proxyGrid[x][y] = 1
                } 
                }
                catch{
                    console.log("subs");
                }    
                try{
                    if(subs[i].length > 1 && grid[x][y] % subs[i].reduce((a, b) => a*b) == 0 ){
                        if(grid[x][y] / subs[i].reduce((a, b) => a*b < proxyGrid[x][y])){
                            proxyGrid[x][y] = grid[x][y] / subs[i].reduce((a, b) => a*b )
                        }
                        
                    } 
                }
                catch{
                    console.log("bruh")
                }         
            }

            
            
        }
         
    } 

    //check if neighbouring numbers are divisible by number
    for(x=0 ; x < gridSize; x++){
        for(y=0 ; y < gridSize ; y++){
            let isDivider = false
            let checkarr = [false , false , false, false]
            try{
                 if((realgrid[x-1][y] / realgrid[x][y]) % 1 == 0){
                    checkarr[0] =realgrid[x-1][y]
                 }
            }catch{
                checkarr[0] = false
            }
            try{
                if((realgrid[x][y+1] / realgrid[x][y] ) % 1 == 0){
                   checkarr[1] =realgrid[x][y+1]
                }
           }catch{
               checkarr[1]= false
           }
           try{
            if((realgrid[x+1][y] / realgrid[x][y]) % 1 == 0){
               checkarr[2] =realgrid[x+1][y]
            }
            }catch{
                checkarr[2] = false
            }
            try{
                if((realgrid[x][y-1] / realgrid[x][y]) % 1 == 0){
                   checkarr[3] =realgrid[x][y-1]
                }
           }catch{
               checkarr[3] = false
           }
            
           checkarr = checkarr.map(num => {
               if(num > 0 && num < Infinity){
                isDivider = true
                proxyGrid[x][y] = 1                                          
                   return num
               }else{
                   return false
               }
           })
           //pushes the number to the array that is later used to calculate the score 
           if(isDivider){
               dividers.push([...grid][x][y])
           }
        }
        
    }

    updateRealGrid(proxyGrid)
    setTimeout(() => checkLoose(realgrid), 300)
    
}
function create2DArray(size){
    for(let i = 0 ; i < size ; i++){
        grid[i]= []
        proxyGrid[i] = []
    }
}

//updates realGrid array and redraws the affected elements
function updateRealGrid(proxy){
    let changes = false
    for(let x = 0 ; x < gridSize ; x++){
        for(let y = 0 ; y < gridSize ; y ++){
            switch(parseInt(proxy[x][y])){
                case 0:
                    break
                case 1:
                    
                    grid[x][y] = null
                    document.getElementById(`${x}${y}`).innerHTML = null
                    document.getElementById(`${x}${y}`).className = "field"
                    changes = true
                    dividedCount += 1
                    break
                default:
                    grid[x][y] = parseInt(proxy[x][y])
                    document.getElementById(`${x}${y}`).innerHTML = grid[x][y].toString()
                    
                    console.log(document.getElementById(`${x}${y}`))
                    changes = true
                    dividedCount += 1
            }
        }
    }
    
    if(changes){
        updateScore(dividedCount , dividers)
        setTimeout(()=>{
            refresh(grid)
        } , 500)
        
    }
}
function updateScore(count, nums){
    if(count == nums.length ){
        nums.pop()
    }
    console.log(count)
    console.log(nums)
    nums.forEach(element => {
      score = score + element * count  
    })
    
    dividedCount = 0
    dividers = []
    document.getElementById('score').innerHTML = score
}

function checkLoose(arr){
    let filled = 0
    for(let x = 0 ; x < gridSize ; x++){
        for(let y = 0 ; y < gridSize ; y ++){
            if(document.getElementById(`${x}${y}`).innerHTML){
                filled += 1
            }
        }
    }
    if(filled == 9){
        document.getElementById("menu").style.display = "grid"
        document.getElementById("finalscore").innerHTML = score
        
    }
}