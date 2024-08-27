// angular
import { Component, ElementRef, OnInit } from '@angular/core';
// custom service
import { StencilService } from '../services/stencil-service';
import { ToolbarService } from '../services/toolbar-service';
import { InspectorService } from '../services/inspector-service';
import { HaloService } from '../services/halo-service';
import { KeyboardService } from '../services/keyboard-service';
import RappidService from '../services/main-service'
//
import { ThemePicker } from '../components/theme-picker';
import { sampleGraphs } from '../config/sample-graphs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: true,
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {

  private rappid: RappidService;

  constructor(private element: ElementRef){}

  public ngOnInit(): void {

    this.rappid = new RappidService(
      this.element.nativeElement,
      new StencilService(),
      new ToolbarService(),
      new InspectorService(),
      new HaloService(),
      new KeyboardService()
    );

    this.rappid.startRappid();

    const themePicker = new ThemePicker({ mainView: this.rappid });
    document.body.appendChild(themePicker.render().el);

    // restore
    this.rappid.graph.fromJSON(JSON.parse(sampleGraphs.emergencyProcedure));
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
