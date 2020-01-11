import networkx as networkx
# Dependency for networkx
import pygraphviz

#import warnings
#from .agraph import AGraph, Node, Edge, Attribute, ItemAttribute, DotError
def gen_gnp_graph(i):
    """
    Generate a gnp random graph with 2**i nodes.
    """
    n = 2**i
    p = 2*i / (2**i)
    return networkx.generators.directed.random_k_out_graph(10, 3, 0.5)
    #return networkx.fast_gnp_random_graph(n,p, directed=True)


graph = gen_gnp_graph(2)
pos = networkx.nx_agraph.graphviz_layout(graph)
pos = networkx.nx_agraph.graphviz_layout(graph, prog='dot')
networkx.draw(graph, with_labels=True)

degree_centrality = networkx.degree_centrality(graph)
print(degree_centrality)
assert degree_centrality["E"] == 4/5

degree_centrality = networkx.degree_centrality(graph)
print(degree_centrality)
#assert degree_centrality["E"] == 4/5


closeness_centrality = networkx.closeness_centrality(graph)
print(closeness_centrality)
#assert closeness_centrality["E"] == 5/6


#s = degree_centrality + closeness_centrality
print(degree_centrality)
print(closeness_centrality)
# degree_centrality = centrality;
# print(centrality)
# print(bc)
result1 = {key: degree_centrality.get(key, 0) + closeness_centrality.get(key, 0)
           for key in set(degree_centrality) | set(closeness_centrality)}

# result2 = {key: result1.get(key, 0) + centrality.get(key, 0)
#            for key in set(result1) | set(centrality)}

#result3 = {key: result2.get(key, 0) + bc.get(key, 0)
#          for key in set(result2) | set(bc)}
# result3 = result2
# print(result3)
# print(max(result3, key=result3.get))
