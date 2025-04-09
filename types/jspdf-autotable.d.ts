// src/@types/jspdf-autotable.d.ts
import { jsPDF } from 'jspdf';

declare module 'jspdf' {
  interface jsPDF {
    autoTable: any; // You can define a more specific type if needed
  }
}