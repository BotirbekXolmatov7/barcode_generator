import { Component, ElementRef, Renderer2 } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AppService } from '../app.service';
import JsBarcode from 'jsbarcode';
import { NgFor, NgIf } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-barcode-generator',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, NgIf, NgFor],
  templateUrl: './barcode-generator.component.html',
  styleUrl: './barcode-generator.component.scss'
})
export class BarcodeGeneratorComponent {
  barcodeForm: FormGroup;
  barcodes: string[] = [];
  product!: any
  productId!: any;
  constructor(
    private el: ElementRef,
    private fb: FormBuilder,
    private renderer: Renderer2,
    private _appService: AppService,
    private _activeRoute: ActivatedRoute
  ) {
    this.barcodeForm = this.fb.group({
      baseBarcode: ['', Validators.required],
      count: [1, [Validators.required, Validators.min(1)]],
    });
  }


  ngOnInit(): void {
    this._activeRoute.params.subscribe((param: any)=>{
      this.productId = param.id
    })
    this._appService.getProductById(this.productId).subscribe((res: any)=>{
      const {barcode} = res.meta
      this.barcodeForm.get('baseBarcode')?.setValue(barcode.substring(1, 13))
      this.valueLengthMeter('baseBarcode', 12, 12)
    })
  }

  valueLengthMeter(controlName: string, maxLength: number, setLength?: number) {
    const element = this.el.nativeElement.querySelector(
      `p[id='${controlName}']`
    );
    this.barcodeForm.get(controlName)?.valueChanges.subscribe((value) => {
      if (element) {
        this.renderer.setProperty(
          element,
          'innerText',
          `${value.toString()?.length || 0}/${maxLength}`
        );
      }
    });

    if (setLength) {
      this.renderer.setProperty(
        element,
        'innerText',
        `${setLength || 0}/${maxLength}`
      );
    }
  }

  generateBarcodes(): void {
    const baseBarcode = this.barcodeForm.value.baseBarcode;
    const count = this.barcodeForm.value.count;

    this.barcodes = [];
    for (let i = 0; i < count; i++) {
      this.barcodes.push(baseBarcode);
    }

    setTimeout(() => {
      this.renderBarcodes();
    });
  }

  renderBarcodes(): void {
    this.barcodes.forEach((barcode, index) => {
      const svgElement = document.getElementById(`barcode-${index}`);
      if (svgElement) {
        JsBarcode(svgElement, barcode, {
          format: 'EAN13',
          lineColor: '#000',
          width: 2,
          height: 50,
          displayValue: true,
        });
      }
    });
  }

  printBarcodes(): void {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(
        '<html><head><title>Print Barcodes</title></head><body>'
      );
      this.barcodes.forEach((barcode, index) => {
        const svgElement = document.getElementById(`barcode-${index}`);
        if (svgElement) {
          printWindow.document.write(svgElement.outerHTML);
        }
      });
      printWindow.document.write('</body></html>');
      printWindow.document.close();
      printWindow.print();
    }
  }
}
