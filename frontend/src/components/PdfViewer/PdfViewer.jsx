import { useState } from 'react';
import { Document, Page } from 'react-pdf';
import pdf from './VoVietNhan241844011.pdf'
function PdfViewer(props) {
    const [numPages, setNumPages] = useState();
    const [pageNumber, setPageNumber] = useState(1);

    function onDocumentLoadSuccess({ numPages }) {
        setNumPages(numPages);
    }
    console.log(props.pdfFile);
    return (
        <div>
            <Document file={props.pdfFile} onLoadSuccess={onDocumentLoadSuccess}>
                {Array.apply(null, Array(numPages))
                    .map((x, i) => i + 1)
                    .map((page) => {
                        return (
                            <Page
                                pageNumber={page}
                                renderTextLayer={false}
                                renderAnnotationLayer={false}
                            />
                        );
                    })}
            </Document>
            <p>
                Page {pageNumber} of {numPages}
            </p>
        </div>
    );
}
export default PdfViewer