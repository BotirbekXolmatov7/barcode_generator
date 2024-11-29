import { NgFor, NgIf } from '@angular/common';
import { Component, ElementRef, Renderer2 } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import JsBarcode from 'jsbarcode';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FormsModule, NgIf, NgFor, ReactiveFormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  barcodeForm: FormGroup;
  barcodes: string[] = [];

  constructor(
    private el: ElementRef,
    private fb: FormBuilder,
    private renderer: Renderer2
  ) {
    this.barcodeForm = this.fb.group({
      baseBarcode: ['', Validators.required],
      count: [1, [Validators.required, Validators.min(1)]], 
    });
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
