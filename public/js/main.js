// FRONT-END (CLIENT) JAVASCRIPT HERE
const bricks = [ //For testing purposes
    {
        id: 1,
        title: "First Brick",
        body: "This is the first brick.",
        parentId: null
    },

    {
        id: 2,
        title: "Second Brick",
        body: "This is connected to the first brick.",
        parentId: 1
    }
];
let brickID = 0
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

  brickElement.addEventListener( 'click', function(event) {
    selectedBrickID = event.currentTarget.dataset.id
    console.log( 'selectedBrickID:', selectedBrickID )
    console.log('Selected brick', brick)
  })

  document.getElementById("brickWall").appendChild( brickElement )
}
bricks.forEach(displayBrick)

function clearWall(){
  const wall = document.querySelector( '#brickWall' )
  wall.innerHTML = ''
  bricks = []
}
document.getElementById('clearWall').addEventListener('click', clearWall)



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
  displayBrick( brick )
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
