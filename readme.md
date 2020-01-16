### Introduction

Graph network is one of the most important sectors in
computer science because of its versatility in representing
various real life phenomena. The objective of this project is
to implement random graph network and determine the
most influential node based on three measures of centrality.

### Demo

The demo is available [here](http://algo-tu-2020.ee.s3-website.eu-central-1.amazonaws.com/)

### Reading the outcome

- ![#f03c15](https://placehold.it/15/f03c15/000000?text=+) `#ff0000` - Edge with the highest [Edge Betweenness Centrality (EBC)](https://link.springer.com/referenceworkentry/10.1007%2F978-1-4419-9863-7_874). 
If no edge is marked as red then this implies 
that there is no single edge with the highest EBC.
- ![#c5f015](https://placehold.it/15/c5f015/000000?text=+) `#c5f015` - Node (vertex) that our algorithm has determined to be the most influential one.

### Options

- User can generate a random graph of **n** nodes with **p** (probability) for edge creation
- User can add nodes to the graph
- User can delete nodes from the graph
- User can add an edge to the graph
- User can delete an edge from the graph

### Development

Run 
```$xslt
npm run start
```
this will open a http web server at port 8080 to serve local files.
