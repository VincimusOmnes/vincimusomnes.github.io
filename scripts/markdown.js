export const markdownToHtml = (markdown, path) => {
    let html = markdown;
    // This needs to be escaped if open to untrusted input
    html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>')
    html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
    html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
    html = html.replace(/^#### (.*$)/gim, '<h4>$1</h4>');
    html = html.replace(/^##### (.*$)/gim, '<h5>$1</h5>');
    html = html.replace(/^###### (.*$)/gim, '<h6>$1</h6>');
    // ![Alt text](url "a title")
    const imgReg = /!\[([^\]]*)\]\(([^)\s]+)(?:\s+"([^"]+)")?\)/g;
    html = html.replace(imgReg, `<img src="posts/${path}/images/$2" alt="$1" title="$3">`);
    // Links
    const linkReg = /\[([^\]]+)\]\(([^)\s]+)(?:\s+"([^"]+)")?\)/g;
    html = html.replace(linkReg, `<a href="$2">$1</a>`);
    
    // Text styles
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>'); // Bold
    html = html.replace(/\*(.*?)\*/g, '<em>$1</em>'); // Italic
    html = html.replace(/~~(.*?)~~/g, '<del>$1</del>'); // Strikethrough
    html = html.replace(/`(.*?)`/g, '<code>$1</code>'); // Inline code
    
    // TODO: Syntax highlighting
    
    // Tables
    html = html.replace(/\|(.+)\|\r?\n\|\s*([:\-|\s]+)\s*\|\r?\n((?:\|.*\|\r?\n?)*)/gm, (match, header, align, rows) => {
        const headers = header.split('|').map(h => h.trim()).filter(h => h);
        const aligns = align.split('|').map(a => a.trim()).filter(a => a);
        const rowData = rows.trim().split('\n').map(r => r.split('|').map(c => c.trim()).filter(c => c));
        
        let tableHtml = '<table><thead><tr>';
        headers.forEach((h, i) => {
            let alignAttr = '';
            if (aligns[i].startsWith(':') && aligns[i].endsWith(':')) alignAttr = ' style="text-align:center;"';
            else if (aligns[i].startsWith(':')) alignAttr = ' style="text-align:left;"';
            else if (aligns[i].endsWith(':')) alignAttr = ' style="text-align:right;"';
            tableHtml += `<th${alignAttr}>${h}</th>`;
        });
        tableHtml += '</tr></thead><tbody>';
        rowData.forEach(row => {
            tableHtml += '<tr>';
            row.forEach((cell, i) => {
                let alignAttr = '';
                if (aligns[i].startsWith(':') && aligns[i].endsWith(':')) alignAttr = ' style="text-align:center;"';
                else if (aligns[i].startsWith(':')) alignAttr = ' style="text-align:left;"';
                else if (aligns[i].endsWith(':')) alignAttr = ' style="text-align:right;"';
                tableHtml += `<td${alignAttr}>${cell}</td>`;
            });
            tableHtml += '</tr>';
        });
        tableHtml += '</tbody></table>\n'; // add a newline so following list regex sees the boundary
        return tableHtml;
    });

    // Lists
    // This will result in always unordered lists
    html = html.replace(/(^|\n)((?:\s*[-+*] .*(?:\n|$))+)/g, (m, before, block) => {
        const items = block.replace(/^\s*[-+*] (.*)$/gm, '<li>$1</li>');
        return `${before}<ul>\n${items}</ul>\n`;
    });

    // Wrap contiguous ordered list blocks (preserve numbering with <ol>)
    html = html.replace(/(^|\n)((?:\s*\d+\. .*(?:\n|$))+)/g, (m, before, block) => {
        const items = block.replace(/^\s*\d+\. (.*)$/gm, '<li>$1</li>');
        return `${before}<ol>\n${items}</ol>\n`;
    });
    // Escape characters [TODO]
    
    return html;
}