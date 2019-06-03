# React Cellular Automatia

## Conway's Game Of Life

### Live Demo 
- https://react-cellular-automata.jamesmcguigan.now.sh


### Rules

#### Internet Explanations of The Game Of Life
- https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life
- https://www.youtube.com/watch?v=tENSCEO-LEc

#### Classic Rules (Rule 3):
- Any live cell with fewer than two live neighbours dies, as if by underpopulation.
- Any live cell with two or three live neighbours lives on to the next generation.
- Any live cell with more than three live neighbours dies, as if by overpopulation.
- Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.

#### Rule Numbers

The rules are defined in terms of a number.

A cell must have exactly that number of neighbours (either including or excluding itself) 
to either survive or be born into the next generation.

To give Rule 3 as an example, a dead cell needs exactly 3 neighbours to be born, 
whilst a live cell needs either 2 or 3 neighbours to survive. All other combinations 
of neighbours result in a dead cell.  


### Observations

#### Rule 0
- Bitmap inverse with 1 cell of padding
- This is the only rule that repeats when given either an empty or a full board 

#### Rule 1
- A single dot or a square will grow into a fractal expanse of squares
- A diagonal line of dots will give fractal squares but with diamonds along the main diagonal  
- A line of adjacent dots will expand into artwork reminiscent of Space Invaders
- Filling the board instantly dies

### Rule 2
- A single dot will die, in this and in all higher numbered rules
- A line of adjacent cells will grow into a flower
- A square will grow into a symmetrical flower
- A diagonal line of cells will grow into butterfly
- Filling the board instantly dies

### Rule 3
- This rule may have the most patterns: [Wikipedia](https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life#Examples_of_patterns)    
- A diagonal line of cells will shrink each generation by one cell on each end until it dies
- A line of three cells will two-step oscillate between horizontal and vertical
- A line of cells will turn into a square/rectangle, before eventually oscillating over a fixed number of simple patterns
- Filling the board will collapse into the corners before dying

### Rule 4
- A horizontal, vertical or diagonal line of cells will instantly die
- A 2x2 square of cells is stable
- Most other shapes will decompose into smaller squares and then eventually die
- Filling the board will collapse into the corners before dying 

### Rules 5 + 6
- No shapes are stable, but it takes a few generations to die 
- Filling the board will collapse into the edges (witout corners) before dying

### Rule 7
- The U shape will survive for 1 generation as a dot
- Everything else instantly dies
- Filling the board instantly dies  

### Rules 8 + 9
- Filling the board results in a square that shrinks in size by one every generation until it dies
- Everything else instantly dies
