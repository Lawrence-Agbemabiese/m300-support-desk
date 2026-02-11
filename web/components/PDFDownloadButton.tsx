'use client';

import { useState } from 'react';
import { pdf } from '@react-pdf/renderer';
import { Button } from '@/components/ui/Button';
import { AnalysisPDF } from '@/components/AnalysisPDF';
import type { AnalysisResult } from '@/lib/schemas';

interface PDFDownloadButtonProps {
  result: AnalysisResult;
  className?: string;
}

export function PDFDownloadButton({ result, className }: PDFDownloadButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    setLoading(true);
    try {
      // Generate PDF blob
      const blob = await pdf(<AnalysisPDF result={result} />).toBlob();

      // Create download link
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;

      // Generate filename from project name
      const filename = `${result.project.project_name.replace(/[^a-z0-9]/gi, '_')}_M300_Analysis.pdf`;
      link.download = filename;

      // Trigger download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Clean up
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={handleDownload}
      loading={loading}
      variant="outline"
      className={className}
    >
      <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
      {loading ? 'Generating PDF...' : 'Download PDF'}
    </Button>
  );
}
