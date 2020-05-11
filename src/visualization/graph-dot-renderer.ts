import { IDirectedGraph } from '../dep-graph/directed-graph';

export class GraphDotRenderer {
    public static getDotRepresentation(directedGraph: IDirectedGraph): string {
        return `digraph {${GraphDotRenderer.getAllNodeDeclarations(directedGraph)} ${GraphDotRenderer.getAllEdgeDeclarations(
            directedGraph
        )}}`;
    }

    private static getAllNodeDeclarations(directedGraph: IDirectedGraph): string {
        return directedGraph.nodes.map(node => `${GraphDotRenderer.getDotConformNodeName(node.name)} [label="${node.name}"];`).join('');
    }

    private static getAllEdgeDeclarations(directedGraph: IDirectedGraph): string {
        return directedGraph.nodes
            .map(ancestor =>
                ancestor
                    .getChildren()
                    .map(
                        child =>
                            `${GraphDotRenderer.getDotConformNodeName(ancestor.name)} -> ${GraphDotRenderer.getDotConformNodeName(
                                child.name
                            )};`
                    )
                    .join('')
            )
            .join('');
    }

    private static getDotConformNodeName(projectName: string): string {
        return projectName.replace(/-/g, '_');
    }
}
