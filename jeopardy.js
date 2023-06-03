const API_URL = "https://jservice.io/api/";
const NUM_CATEGORIES = 6;
const NUM_CLUES_PER_CAT = 5;


let categories = [];
let qaArray = []


async function getCategoryIds() {

    for(let i = 0; categories.length <= 6; i++){
        const results = await axios.get(`${API_URL}categories?count=100`)
        let num = Math.floor(Math.random() * 100)
        // console.log(num)
        // console.log(results.data)
        // console.log(results.data[num])
        // console.log(results.data[num].id.data.clues)
    
        let catId = results.data[num].id
    
        let category = await getCategory(catId)
        
        if(Array.isArray(category.clues) && category.clues.length >= 15){
            let catObj = {category: category.title, clues: category.clues}
            categories.push(catObj)
        }
    }
    console.log(categories)
    fillCategories(categories)

}


async function getCategory(catId) {

    const results = await axios.get(`${API_URL}category?id=${catId}`)
    console.log(results.data)

    return results.data

}

function fillCategories(categories){
    for(let i = 0; i < NUM_CATEGORIES; i ++){
        $(`#${i}`).append(`<p>${categories[i].category}</p>`)

    }

    let j = 0;
    for(let i = 0; j < NUM_CATEGORIES; i++){

        const num = Math.floor(Math.random() * categories[j].clues.length)

       if(i > NUM_CATEGORIES){

       j++
       i = -1

     } else{
        $(`#${i}-${j}`).append(`<p class="hidden q">${categories[j].clues[num].question}`)
        $(`#${i}-${j}`).append(`<p class="hidden a">${categories[j].clues[num].answer}`)

        let qa = categories[j].clues[num]
        qaArray.push(qa)
        categories[j].clues.splice(num, 1)

     }

    }

}


function createTable(){
    const board = document.getElementById('board');

    // make column tops 
    const top = document.createElement('tr');
    top.setAttribute('id', 'column-top');
  
    for (let x = 0; x < NUM_CATEGORIES; x++) {
      const headCell = document.createElement('td');
      headCell.setAttribute('id', x);
      top.append(headCell);
    }
  
    board.append(top);
  
    // make main part of board
    for (let y = 0; y < NUM_CLUES_PER_CAT; y++) {
      const row = document.createElement('tr');

  
      for (let x = 0; x < NUM_CATEGORIES; x++) {
        const cell = document.createElement('td');
        cell.innerText = '?'
        cell.setAttribute('id', `${y}-${x}`);
        cell.setAttribute('class', "qa");

        row.append(cell);
      }
  
      board.append(row);
      
    }

    $('.qa').on('click', function(evt){
        let e = evt.target
        console.log(e.innerText)


        if(e.innerText === '?'){
            let clickArr = []
            let a = e.children[1].innerText
            clickArr.push(a)
            console.log(clickArr)

            $(`#${e.id}`).text(`${e.children[0].innerText}`)
            $(`#${e.id}`).append(`<p class="hidden"> ${clickArr[0]}</p>`)

            
        } 
        else if(e.children.length === 1){

            $(`#${e.id}`).text(e.children[0].innerText)

        }


    })
}


function deleteAll(){
    $('tr').remove()
    $('p').remove()
    categories = []
}

function newGame(){

    getCategoryIds()
    createTable()

}

$('#newBtn').on('click', function(){
    deleteAll()
    newGame()
    console.log('click')
})