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

async function clearWall(){
  brickID = 0
  selectedBrickID = -1

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
