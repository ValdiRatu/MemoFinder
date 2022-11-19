import * as go from 'gojs'
import { ReactDiagram } from 'gojs-react'

import { useData } from '../contexts/DataContext'

export const Tree = () => {
  const { ref, nodesDataArray, linksDataArray } = useData()

  const TreeDiagram = () =>
    new go.Diagram({
      layout: new go.TreeLayout({
        angle: 90
      }),
      allowDelete: false,
      allowCopy: false,
      allowInsert: false,
      model: new go.GraphLinksModel({
        linkKeyProperty: 'key'
      }),
      // DOCS: https://gojs.net/latest/intro/buildingObjects.html
      nodeTemplate: new go.Node('Auto')
        .add(
          new go.Shape('Rectangle', { strokeWidth: 1 }).bind(
            new go.Binding('fill', 'color')
          )
        )
        .add(
          new go.TextBlock({
            margin: 10,
            font: 'bold 14px sans-serif',
            stroke: '#333'
          }).bind('text', 'label')
        ),
      linkTemplate: new go.Link({
        routing: go.Link.Normal,
        corner: 0
      })
        .add(new go.Shape({ strokeWidth: 1.5 }))
        .add(new go.Shape({ toArrow: 'Standard', stroke: null, scale: 1 }))
        .add(
          new go.TextBlock({
            segmentOffset: new go.Point(0, 15),
            font: '12px sans-serif',
            stroke: '#333'
          }).bind('text', 'label')
        )
    })

  return (
    <ReactDiagram
      ref={ref}
      divClassName="graph"
      initDiagram={TreeDiagram}
      nodeDataArray={nodesDataArray}
      linkDataArray={linksDataArray}
    />
  )
}
