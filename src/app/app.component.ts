// angular
import { AfterViewInit , Component, ElementRef, ViewChild, OnInit } from '@angular/core';
// jointjs/plus
import { dia, ui, shapes } from '@joint/plus';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: true,
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit, AfterViewInit  {

  @ViewChild('canvas') canvas: ElementRef;

  private graph: dia.Graph;
  private paper: dia.Paper;
  private scroller: ui.PaperScroller;

  public ngOnInit(): void {

    const graph = this.graph = new dia.Graph({}, { cellNamespace: shapes });

    const paper = this.paper = new dia.Paper({
        model: graph,
        width: 1000,
        height: 1000,
        background: {
            color: '#F8F9FA',
        },
        frozen: true,
        async: true,
        sorting: dia.Paper.sorting.APPROX,
        cellViewNamespace: shapes
    });

    const scroller = this.scroller = new ui.PaperScroller({
        paper,
        autoResizePaper: true,
        cursor: 'grab'
    });

    scroller.render();

    const rect = new shapes.standard.Rectangle({
        position: { x: 25, y: 25 },
        size: { width: 50, height: 100 },
        attrs: {
            label: {
                text: 'Hello Rectangle 1'
            }
        }
    });

    this.graph.addCell(rect);

    const rect2 = new shapes.standard.Rectangle({
      position: { x: 275, y: 175},
      size: {width: 50, height: 100},
      attrs: {
        label: {
          text: "Hello Rectangle 2"
        }
      }
    });

    this.graph.addCell(rect2);

    const rect3 = new shapes.standard.Rectangle();
    rect3.position(800, 900);
    rect3.resize(180, 50);
    rect3.attr('label', { text: 'Hello Rectangle 3' });
    rect3.addTo(graph);


    const link = new shapes.standard.Link();
    link.source(rect);
    link.target(rect2);
    link.appendLabel({
      attrs: {
          text: {
              text: 'to the'
          }
      }
    });
    link.router('orthogonal');
    link.connector('straight', {  cornerType: 'line' });
    
    link.addTo(graph);

  }

  public ngAfterViewInit(): void {

    const { scroller, paper, canvas } = this;
    canvas.nativeElement.appendChild(this.scroller.el);
    scroller.center();
    paper.unfreeze();

  }

  /* 
    Drawing Library Request Needed
      Type of support: Company
      Is there active support: Yes
      License? 
      Cost?
      Advantages/Disadvantages?
      Serialization and deserialization?
      Grouping of elements?
      Limiting the "palette" of elements to use?

    PoC Scope
      Columns:
        Supuestos Nivel 1
        Productos
        Supuestos Nivel 2
        Objetivos Especificos
        Supuestos Nivel 3
        Objetivo General
      Boxes
        Group Box
        Individual Box
        Label
        Configuration: Color, Borders, Etc
        2 Types: Group vs Individual Style
      Arrows
        Source, Target
        Arrow Style
        Line Style
        Arrow Midle Text or Tag
      Utilities
        Export graph
        Import graph

  */


}
