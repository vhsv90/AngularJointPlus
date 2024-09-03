// angular
import { Component, ViewChild, OnInit } from '@angular/core';
// jointjs/plus
import { dia, ui, shapes, util, format } from '@joint/plus';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: true,
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {

  public ngOnInit(): void {

    //#region foreign-object-configuration

    const Form = dia.Element.define('example.Form', {
      attrs: {
          foreignObject: {
              width: 'calc(w)',
              height: 'calc(h)'
          }
      }
    }, {
      markup: util.svg/* xml */`
        <foreignObject @selector="foreignObject">
            <div
                xmlns="http://www.w3.org/1999/xhtml"
                class="outer"
            >
                <div class="inner">
                    <form class="form">
                        <input @selector="name" type="text" name="name" autocomplete="off" placeholder="Your diagram name"/>
                        <button>
                            <span>Submit</span>
                        </button>
                    </form>
                </div>
            </div>
        </foreignObject>
        `
      });

    const FormView = dia.ElementView.extend({
      events: {
          'submit form': 'onSubmit',
          'change input': 'onChange'
      },
  
      onSubmit: function (evt: any) {
          evt.preventDefault();
          alert('onSubmit action')
          this.model.attr('name/props/value', '');
      },
  
      onChange: function (evt: any) {
          this.model.attr('name/props/value', evt.target.value);
      }
    });

    const namespace = {
      ...shapes,
      example: {
          Form,
          FormView
      }
    }
    
    //#endregion

    //#region main-properties
    const graph = new dia.Graph({}, { cellNamespace: shapes });
    //const namespace = shapes;
    
    const paper = new dia.Paper({
      el: document.getElementById('paper'),
      model: graph,
      width: 700,
      height: 500,
      background: { color: '#F5F5F5' },
      cellViewNamespace: namespace
    });

    // const paperScroller = new ui.PaperScroller({
    //   paper: paper,
    //   scrollWhileDragging: true,
    // });
    // paperScroller.render();
    
    //#endregion


    //#region rectangle-creation
    const rect1 = new shapes.standard.Rectangle();
    rect1.position(25, 25);
    rect1.resize(180, 50);
    
    const rect2 = new shapes.standard.Rectangle();
    rect2.position(95, 225);
    rect2.resize(180, 50);

    rect1.attr('body', { stroke: '#C94A46', rx: 2, ry: 2 });
    rect2.attr('body', { stroke: '#C94A46', rx: 2, ry: 2 });

    rect1.attr('label', { text: 'Hello', fill: '#353535' });
    rect2.attr('label', { text: 'World!', fill: '#353535' });

    rect1.addTo(graph);
    rect2.addTo(graph);  

    //#endregion

    //#region adding-links-to-objects
    const link = new shapes.standard.Link();
    link.source(rect1);
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

    //#endregion


    //#region stencil-configuration
    const stencil = new ui.Stencil({
      paper: paper,
      el: document.getElementById('stencil'),
      width: 170,
      height: 170,
      layout: true,
      dropAnimation: true
    });

    stencil.render();

    const elements = [
      {
          type: 'standard.Rectangle',
          size: { width: 70, height: 50 },
          attrs: {
              body: {
                  stroke: '#C94A46',
                  rx: 2,
                  ry: 2
              }
          }
      },
      {
          type: 'standard.Ellipse',
          size: { width: 70, height: 50 },
          attrs: {
              body: {
                  stroke: '#C94A46',
              }
          }
      },
      {
          type: 'standard.Polygon',
          size: { width: 70, height: 50 },
          attrs: {
              body: {
                  stroke: '#C94A46',
                  points: 'calc(w/2),0 calc(w),calc(h/2) calc(w/2),calc(h) 0,calc(h/2)'
              }
          }
      },
      {
          type: 'standard.Cylinder',
          size: { width: 70, height: 50 },
          attrs: {
              body: {
                  stroke: '#C94A46',
              },
              top: {
                  fill: '#C94A46',
                  stroke: '#C94A46'
              }
          }
      }
    ];
  
    stencil.load(elements);

    //#endregion

    //#region halo-configuration 
    function openHalo(cellView: any) {
      new ui.Halo({ cellView: cellView }).render();
    }

    paper.on('cell:pointerup', (cellView) => {
      openHalo(cellView);
    });
    
    openHalo(paper.findViewByModel(rect2)); //openHalo(paper.findViewByModel(rect1));
    
    //#endregion

    //#region toolbar-configuration
    const toolbar = new ui.Toolbar({
      el: document.getElementById('toolbar'),
      tools: [
          {
              type: 'button',
              name: 'json',
              text: 'Export JSON'
          },
          {
              type: 'button',
              name: 'svg',
              text: 'Export SVG'
          },
          'separator'
      ],
    });
    toolbar.render();

    toolbar.on('json:pointerclick', () => {
      const str = JSON.stringify(graph.toJSON());
      console.log('export-to-json-result: ', str)
      const bytes = new TextEncoder().encode(str);
      const blob = new Blob([bytes], { type: 'application/json;charset=utf-8' });
      util.downloadBlob(blob, 'joint-plus.json');
    });
  
    toolbar.on('svg:pointerclick', () => {
        format.toSVG(
            paper,
            (svg) => {
                util.downloadDataUri(
                    `data:image/svg+xml,${encodeURIComponent(svg)}`,
                    'joint-plus.svg'
                );
            },
            { useComputedStyles: false }
        );
    });

    //#endregion 

    //#region inspector-configuration
    function openInspector(cell: any) {
      closeInspector(); // close inspector if currently open
  
      ui.Inspector.create('#inspector', {
          cell: cell,
          inputs: getInspectorConfig(cell)
      });
    }
  
    function closeInspector() {
        ui.Inspector.close();
    }
  
    function getInspectorConfig(cell: any) {
        if (cell.isElement()) {
            return {
                attrs: {
                    label: {
                        text: {
                            type: 'content-editable',
                            label: 'Label'
                        }
                    }
                }
            };
    
        } else { // cell.isLink()
            return {
                labels: {
                    type: 'list',
                    label: 'Labels',
                    item: {
                        type: 'object',
                        properties: {
                            attrs: {
                                text: {
                                    text: {
                                        type: 'content-editable',
                                        label: 'Text',
                                        defaultValue: 'label'
                                    }
                                },
                            },
                            position: {
                                type: 'select-box',
                                options: [
                                    { value: 30, content: 'Source' },
                                    { value: 0.5, content: 'Middle' },
                                    { value: -30, content: 'Target' }
                                ],
                                defaultValue: 0.5,
                                label: 'Position'
                            }
                        }
                    }
                }
            };
        }
    }
  
    paper.on('cell:pointerdown', function (cellView) {
      openInspector(cellView.model);
    });

    stencil.on('element:drop', function (elementView) {
        openInspector(elementView.model);
    });

    paper.on('blank:pointerdown',  () => {
        closeInspector(); // close inspector if currently open
    });

    //#endregion

    // testing inspector with rect1
    //openInspector(rect2);
    openInspector(rect1);     

    //#region adding-foreign-object-to-graph
    const form = new Form();
    form.position(300, 400);
    form.resize(355, 200);
    form.addTo(graph);
    //paper.freeze();
    //#endregion



  }

}
