"""
Script di minificazione interno per styles.css → styles.min.css e script.js → script.min.js.
Eseguito una volta dopo modifiche ai sorgenti. NON committato come asset di produzione,
ma utility di build (referenziato come tale nel README).

Uso:
    python _minify.py
"""
import re
import os

ROOT = os.path.dirname(os.path.abspath(__file__))


def minify_css(src: str) -> str:
    # Rimuove i commenti /* ... */
    src = re.sub(r'/\*.*?\*/', '', src, flags=re.DOTALL)
    # Collassa whitespace
    src = re.sub(r'\s+', ' ', src)
    # Rimuove spazi attorno a { } : ; , > + ~
    src = re.sub(r'\s*([{}:;,>+~])\s*', r'\1', src)
    # Rimuove ; finale prima di }
    src = re.sub(r';}', '}', src)
    return src.strip()


def minify_js(src: str) -> str:
    # Strategia conservativa: solo rimozione commenti.
    # Mantiene newlines e spaziature interne per evitare problemi con
    # ASI (Automatic Semicolon Insertion) e regex literal vs divisione.
    # Rimuove /* ... */ multi-line
    src = re.sub(r'/\*.*?\*/', '', src, flags=re.DOTALL)
    # Rimuove // commenti a fine riga (evita di mangiare URL come "https://")
    out_lines = []
    for line in src.split('\n'):
        # Trova posizione di "//" non dentro stringa: euristica conservativa.
        # Salta linee con "://" (URL) — meglio non toccare quelle linee.
        # Rimuove solo se non c'è "://" prima del "//"
        if '://' in line:
            out_lines.append(line)
            continue
        # Rimuovi commenti // a fine riga
        m = re.search(r'//.*$', line)
        if m:
            line = line[:m.start()].rstrip()
        out_lines.append(line)
    src = '\n'.join(out_lines)
    # Collassa righe vuote multiple
    src = re.sub(r'\n\s*\n+', '\n', src)
    return src.strip() + '\n'


def main():
    css_path = os.path.join(ROOT, 'styles.css')
    js_path = os.path.join(ROOT, 'script.js')

    with open(css_path, 'r', encoding='utf-8') as f:
        css_src = f.read()
    css_min = minify_css(css_src)
    with open(os.path.join(ROOT, 'styles.min.css'), 'w', encoding='utf-8') as f:
        f.write(css_min)
    print(f'styles.css {len(css_src):>7} -> styles.min.css {len(css_min):>7} bytes ({100 - 100*len(css_min)/len(css_src):.1f}% saved)')

    with open(js_path, 'r', encoding='utf-8') as f:
        js_src = f.read()
    js_min = minify_js(js_src)
    with open(os.path.join(ROOT, 'script.min.js'), 'w', encoding='utf-8') as f:
        f.write(js_min)
    print(f'script.js  {len(js_src):>7} -> script.min.js  {len(js_min):>7} bytes ({100 - 100*len(js_min)/len(js_src):.1f}% saved)')


if __name__ == '__main__':
    main()
