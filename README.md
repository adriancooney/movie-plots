# Movie plots
Literal movie plotting. See the post [here](https://medium.com/p/8b8243f6f3f).

### Setup
Clone the repo and do an `npm install`. Requires `node-canvas` to generate graphs which depends on `cairo`.

### Generating Data
To generate frame data for a film, see the too in `bin/analyze`. Requires Node v0.11.13 for promises.

### Generate Graphs
To generate run `node graphers/nodex/index.js`. Requires Node v0.11.7. This takes all the films in `data`, all the graphers in `graphers` and generates a graph for each film with each graph and saves them in `graphs`. Check out the graphers in `graphers` to create your own. Pretty straight forward with the canvas API.

### Adding Movies
The more the better. Submit a pull request and we'll add it to the data.

### The code
The code is bad. I made terrible decisions multiple times in my 4:00am slumbers. At those times, these decisions seem good but when you come back the next day you think why would you. It's full of weird dependancy chains with different versions of things required. I'm sorry if you try to incorporate this thing into something else, I never mean't to cause such hurt (or release it for that matter).
