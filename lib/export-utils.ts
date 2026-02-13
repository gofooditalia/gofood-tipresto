import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"
import { formatCurrency, formatDate, type Payment, type Loan } from "./loan-data"

export function generateMovementsPDF(payments: Payment[], loans: Loan[]) {
    const doc = new jsPDF()
    const now = new Date()
    const dateStr = formatDate(now.toISOString())

    // Title
    doc.setFontSize(22)
    doc.text("TiPresto - Riepilogo Movimenti", 14, 20)

    doc.setFontSize(10)
    doc.setTextColor(100)
    doc.text(`Generato il: ${dateStr}`, 14, 28)

    // Calculate totals
    const totalOriginal = loans.reduce((sum, loan) => sum + Number(loan.original_amount), 0)
    const totalPaid = payments
        .filter(p => p.status === 'completed')
        .reduce((sum, p) => sum + Number(p.amount), 0)
    const balance = loans.reduce((sum, loan) => sum + Number(loan.current_balance), 0)

    // Summary section
    doc.setFontSize(14)
    doc.setTextColor(0)
    doc.text("Riepilogo Stato Prestito", 14, 40)

    autoTable(doc, {
        startY: 45,
        head: [['Descrizione', 'Importo']],
        body: [
            ['Totale Prestiti', formatCurrency(totalOriginal)],
            ['Totale Versato (Confermato)', formatCurrency(totalPaid)],
            ['Saldo Rimanente', formatCurrency(balance)],
        ],
        theme: 'striped',
        headStyles: { fillColor: [37, 99, 235] }, // #2563eb
    })

    // Movements section
    const finalY = (doc as any).lastAutoTable.finalY + 15
    doc.setFontSize(14)
    doc.text("Dettaglio Movimenti", 14, finalY)

    const tableData = payments.map(p => [
        formatDate(p.date),
        loans.find(l => l.id === p.loan_id)?.name || 'Prestito',
        formatCurrency(p.amount),
        p.status.charAt(0).toUpperCase() + p.status.slice(1),
        p.notes || '-'
    ])

    autoTable(doc, {
        startY: finalY + 5,
        head: [['Data', 'Prestito', 'Importo', 'Stato', 'Note']],
        body: tableData,
        theme: 'grid',
        headStyles: { fillColor: [37, 99, 235] }, // #2563eb
        columnStyles: {
            0: { cellWidth: 35 },
            1: { cellWidth: 40 },
            2: { cellWidth: 30 },
            3: { cellWidth: 25 },
            4: { cellWidth: 'auto' },
        }
    })

    // Save the PDF
    doc.save(`movimenti-tipresto-${now.getTime()}.pdf`)
}
