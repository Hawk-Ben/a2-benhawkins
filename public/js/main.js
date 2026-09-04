// FRONT-END (CLIENT) JAVASCRIPT HERE
const bricks = []
let brickID = 0
let selectedBrickID = -1

function displayBrick( brick ) {
  const brickElement = document.createElement( 'div' )

  brickElement.dataset.id = brick.id
  brickElement.classList.add( 'brick' )
  brickElement.innerHTML = `
    <h2>${brick.title}</h2>
    <p>${brick.body}</p>
  `

  brickElement.addEventListener( 'click', function(event) {
    selectedBrickID = event.currentTarget.dataset.id
    console.log( 'selectedBrickID:', selectedBrickID )
  })

  document.getElementById("brickWall").appendChild( brickElement )
}

const loadWall = async function() {
  const response = await fetch( '/bricks' )
  const bricks = await response.json()
  const wall = document.querySelector( '#brickWall' )

  bricks.forEach( function( brick ) {
    displayBrick( brick )
  })
}

function createBrick( title, body ) {
  let newBrick = {
    id: brickID++,
    title: title,
    body: body,
    parentID: -1
  }
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
  console.log( 'bricks:', bricks )

  const body = JSON.stringify( bricks )

  const response = await fetch( '/submit', {
    method:'POST',
    headers: { 'Content-Type': 'application/json' },
    body 
  })

  const text = await response.text()

  console.log( 'text:', text )
}

window.onload = function() {
  const forms = document.querySelectorAll( 'form' )

  forms.forEach( function( form ) {
    form.addEventListener( 'submit', submit )
  })

  if( document.querySelector( '#brickWall' ) ) {
    loadWall()
  }
}
