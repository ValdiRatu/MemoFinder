import { ReactDiagram } from "gojs-react";
import * as go from "gojs";
import { PackedLayout } from "gojs/extensionsJSM/PackedLayout";
import { useData } from "../contexts/DataContext";

export const Grid = () => {
    const { ref, nodesDataArray } = useData();

    const GridDiagram = () => {
        const grid = new go.Diagram({
            layout: new PackedLayout(),
            allowDelete: false,
            allowCopy: false,
            allowInsert: false,
            allowMove: false,
            // DOCS: https://gojs.net/latest/extensionsJSM/PackedLayout.html
            nodeTemplate: new go.Node("Auto")
                .add(new go.Shape({ strokeWidth: 0 })
                    .bind('width', 'width')
                    .bind('height', 'height')
                    .bind('fill', 'color'))
                .add(new go.TextBlock({ margin: 10, font: "bold 14px sans-serif", stroke: '#333' })
                    .bind("text", "label"))
        });
        // These properties exist, but TypeScript doesn't know about them for some reason. Ignore the errors for now.
        // @ts-ignore
        grid.layout.packShape = PackedLayout.Rectangular;
        // @ts-ignore
        grid.layout.spacing = 25;
        return grid;
    }

    return <ReactDiagram
        ref={ref}
        divClassName='graph'
        initDiagram={GridDiagram}
        nodeDataArray={nodesDataArray}
    />
}