// FRONT-END (CLIENT) JAVASCRIPT HERE
const bricks = []
let brickID = 2
let selectedBrickID = -1

function displayBrick( brick ) {
  const brickElement = document.createElement( 'div' )

  brickElement.dataset.id = brick.id
  brickElement.classList.add( 'brick' )

  const titleElement = document.createElement( 'h3' )
  titleElement.textContent = brick.title

  const bodyElement = document.createElement( 'p' )
  bodyElement.textContent = brick.body

  brickElement.appendChild( titleElement )
  brickElement.appendChild( bodyElement )

  brickElement.addEventListener( 'click', brickClicked )

  document.getElementById("brickWall").appendChild( brickElement )
  if (brick.parentID !== -1) {
    parentBrick = bricks.find(parentBrick => Number(parentBrick.id) == brick.parentID)
    parentBrickElement = document.querySelector(`.brick[data-id='${parentBrick.id}']`)
    drawLine( brickElement, parentBrickElement )
  }

  console.log( 'brickElement:', brickElement )
}

async function loadBricks() {
  const response = await fetch( '/bricks' )
  const serverBricks = await response.json()

  bricks.push( ...serverBricks )
  serverBricks.forEach( displayBrick )
}

function brickClicked( event ){
  const brickElement = event.currentTarget
  selectedBrickID = brickElement.dataset.id
  const selectedBrick = bricks.find( function( brick ) {
    return String( brick.id ) === selectedBrickID
  })

  document.querySelectorAll( '.brick.selected' ).forEach( function( element ) {
    element.classList.remove( 'selected' )
  })
  brickElement.classList.add( 'selected' )

  console.log( 'selectedBrickID:', selectedBrickID )
  console.log( 'Selected brick', selectedBrick )

}

function drawLine(brick1, brick2) {
  console.log('Drawing line between', brick1, 'and', brick2)
  const svg = document.getElementById('connection')

  const rect1 = brick1.getBoundingClientRect()
  const rect2 = brick2.getBoundingClientRect()

  const x1 = rect1.left + rect1.width / 2
  const y1 = rect1.top + rect1.height / 2
  const x2 = rect2.left + rect2.width / 2
  const y2 = rect2.top + rect2.height / 2

  const line = document.createElementNS('http://www.w3.org/2000/svg', 'line')

  line.setAttribute('x1', x1)
  line.setAttribute('y1', y1)
  line.setAttribute('x2', x2)
  line.setAttribute('y2', y2)
  line.setAttribute('stroke', 'white')
  line.setAttribute('stroke-width', '3')

  svg.appendChild(line)
}

async function clearWall(){
  brickID = 0
  selectedBrickID = -1

  const svg = document.getElementById('connection')
  svg.innerHTML = ''

  const response = await fetch( '/bricks', {
    method: 'DELETE'
  })

  if( response.ok ) {
    const wall = document.querySelector( '#brickWall' )
    wall.innerHTML = ''
    bricks.length = 0
  }
}
document.getElementById('clearWall').addEventListener('click', clearWall)



function createBrick( title, body ) {
  let newBrick = {
    id: brickID++,
    title: title,
    body: body,
    parentID: selectedBrickID
  }
  console.log( 'newBrick:', newBrick )
  return newBrick
}

const submit = async function( event ) {
  // stop form submission from trying to load
  // a new .html page for displaying results...
  // this was the original browser behavior and still
  // remains to this day
  event.preventDefault()
  
  const form = event.currentTarget
  const formData = new FormData( form )

  const brick = createBrick(
    formData.get( 'title' ),
    formData.get( 'body' )
  )

  bricks.push( brick )
  displayBrick( brick )
  //console.log( 'bricks:', bricks )

  const body = JSON.stringify( brick )

  const response = await fetch( '/bricks', {
    method:'POST',
    headers: { 'Content-Type': 'application/json' },
    body 
  })

  const text = await response.text()

  console.log( 'text:', text )
}

window.onload = function() {
  loadBricks()

  const forms = document.querySelectorAll( 'form' )

  forms.forEach( function( form ) {
    form.addEventListener( 'submit', submit )
  })

}
