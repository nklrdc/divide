const max = 24
const randoms = [Math.floor(Math.random() * 23 + 2) , Math.floor(Math.random() * 23 + 2) , Math.floor(Math.random() * 23 + 2)]
const numbers = document.getElementById("numbers")
const keep = document.getElementById("keep")
let keepMove = false




//create initial tray
randoms.forEach(num => {
    const number = document.createElement("DIV")
    number.className = "tray-number"
    number.innerHTML = num.toString()
    numbers.appendChild(number)
    number.addEventListener("dragover", event => {event.preventDefault()})
    number.addEventListener("dragend", event => dropNumber(event)) 
})

updateFirst()


// setup the keep field
keep.addEventListener("dragover", e => {e.preventDefault()})
keep.addEventListener("dragend" , e => {
    keepMove = true
    dropNumber(e)
})
//hide the keep field when draging
keep.addEventListener("dragstart" , e =>{
    e.target.style.backgroundColor = "darkcyan"
    console.log("drag started")
    setTimeout(() => {
    e.target.style.position = "relative"
    e.target.style.bottom = "10000px"
    }, 10)
    
})
keep.addEventListener("drop",e =>{
    dropAddress = e.target.id
})

// calls the input function that updates the grid if possible
function dropNumber(event){ 
    
    if(!keepMove && dropAddress != null && dropAddress != "keep" && dropAddress != null && !document.getElementById(dropAddress).innerHTML){
        input(dropAddress.toString() , event.target.innerHTML)
        newNumbers()
        dropAddress = null
    }
    if(dropAddress == "keep"){
        dropAddress= null
        if(!keep.innerHTML){
        newNumbers()
        updateKeep(event.target.innerHTML)
        dropAddress = null
        }   
    }
    if(keepMove && event.target.innerHTML && dropAddress != null  && !document.getElementById(dropAddress).innerHTML){
        input(dropAddress , event.target.innerHTML)
        keep.innerHTML = ""
        updateKeep("")
    }
    dropAddress = null
    keepMove = false
    event.target.style.position = ""
    event.target.style.bottom = ""
    if(!keep.innerHTML){
        keep.style.backgroundColor = "white"
    }
}

//adds a new number when a number gets placed
function newNumbers(){
    const number = document.createElement("DIV")
    number.className = "tray-number"
    number.innerHTML = Math.floor(Math.random() * 23 + 2).toString()
    numbers.appendChild(number)
    number.addEventListener("dragover", event => {event.preventDefault()})
    number.addEventListener("dragend", event => dropNumber(event))
    numbers.removeChild(numbers.firstChild)
    numbers.appendChild(number)
    updateFirst()
}
//adds style and functionality to the draggable number
function updateFirst(){
    numbers.firstChild.addEventListener("dragstart" , e=> {
        setTimeout(()=>{
            const element = e.target
            //hides the field when dragging starts by moving it out of view
            element.style.position = "relative"
            element.style.bottom = "10000px"
        },10)
        
    })
    numbers.firstChild.style.border = "solid"
    numbers.firstChild.draggable = "true"

    numbers.firstChild.style.backgroundColor = "darkcyan"
}


//ušdates the keep field
function updateKeep(data){
    if(!keep.innerHTML){
        keep.innerHTML = data
        keep.draggable = "true"
        keep.style.backgroundColor = "darkcyan"
    }else{
        keep.draggable = "false"
        keep.style.backgroundColor = "white"
    }
    if(data === ""){
        keep.draggable = false
        keep.stylebackgroundColor = "white"
    }
        
}
