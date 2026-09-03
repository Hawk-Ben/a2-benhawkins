// FRONT-END (CLIENT) JAVASCRIPT HERE
const bricks = []

const loadWall = async function() {
  const response = await fetch( '/bricks' )
  const bricks = await response.json()
  const wall = document.querySelector( '#brickWall' )

  bricks.forEach( function( brick ) {
    const brickElement = document.createElement( 'article' )
    const title = document.createElement( 'h2' )
    const body = document.createElement( 'p' )

    brickElement.className = 'brick'
    title.textContent = brick.title
    body.textContent = brick.body
    brickElement.append( title, body )
    wall.append( brickElement )
  })
}

const submit = async function( event ) {
  // stop form submission from trying to load
  // a new .html page for displaying results...
  // this was the original browser behavior and still
  // remains to this day
  event.preventDefault()
  
  const form = event.currentTarget
  const formData = new FormData( form )

  const brick = {
    title: formData.get( 'title' ),
    body: formData.get( 'body' )
  }

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
