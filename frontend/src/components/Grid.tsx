import { Diagram, Node, Shape, TextBlock } from 'gojs'
import { PackedLayout } from 'gojs/extensionsJSM/PackedLayout'
import { ReactDiagram } from 'gojs-react'

import { useData } from '../contexts/DataContext'

class RectangularPackedLayout extends PackedLayout {
  constructor() {
    super()
    this.packShape = PackedLayout.Rectangular
    this.sortMode = PackedLayout.Area
    this.spacing = 25
  }
}

export const Grid = () => {
  const { ref, nodesDataArray } = useData()

  const GridDiagram = () =>
    new Diagram({
      layout: new RectangularPackedLayout(),
      allowDelete: false,
      allowCopy: false,
      allowInsert: false,
      allowMove: false,
      // DOCS: https://gojs.net/latest/extensionsJSM/PackedLayout.html
      nodeTemplate: new Node('Auto')
        .add(
          new Shape({ strokeWidth: 0 })
            .bind('width', 'width')
            .bind('height', 'height')
            .bind('fill', 'color')
        )
        .add(
          new TextBlock({
            margin: 10,
            font: 'bold 14px sans-serif',
            stroke: '#333'
          }).bind('text', 'label')
        )
    })

  return (
    <ReactDiagram
      ref={ref}
      divClassName="graph"
      initDiagram={GridDiagram}
      nodeDataArray={nodesDataArray}
    />
  )
}
