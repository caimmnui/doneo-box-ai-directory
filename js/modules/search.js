
'use strict';

function expandQuery(q) {
    const words = q.toLowerCase().split(/\s+/).filter(Boolean);
    const expanded = new Set(words);
    words.forEach(w => {
        Object.keys(synonymMap).forEach(key => {
            if (w.includes(key) || key.includes(w)) {
                synonymMap[key].forEach(s => expanded.add(s));
            }
        });
    });
    return [...expanded];
}

function scoreMatch(tool, terms) {
    let score = 0;
    const searchable = `${tool.name} ${tool.desc} ${tool.category} ${tool.tags || ''}`.toLowerCase();
    terms.forEach(t => {
        if (tool.name.toLowerCase().includes(t)) score += 10;
        else if (tool.category.toLowerCase().includes(t)) score += 5;
        else if (searchable.includes(t)) score += 1;
    });
    return score;
}
