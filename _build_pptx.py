# -*- coding: utf-8 -*-
"""
Genera Eurisko-Sito-Panoramica.pptx — overview del sito per i soci.
Grafica coerente con il tema LIGHT del sito (corpo chiaro, accenti navy/rosso,
chiusura navy come il footer). Logo: logo-eurisko-color.png.
Eseguire: python _build_pptx.py
"""
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.shapes import MSO_SHAPE
from pptx.enum.text import PP_ALIGN, MSO_ANCHOR
from PIL import Image

# --- Palette tema LIGHT del sito ---
PAPER      = RGBColor(0xFF, 0xFF, 0xFF)  # corpo chiaro
PAPER_ALT  = RGBColor(0xF7, 0xF9, 0xFB)  # card
BAND       = RGBColor(0xD8, 0xDF, 0xE8)  # banda slate
NAVY       = RGBColor(0x0A, 0x16, 0x28)  # sezioni scure + testo primario
NAVY_SOFT  = RGBColor(0x14, 0x24, 0x3D)  # card su navy
INK        = RGBColor(0x0A, 0x16, 0x28)  # testo su chiaro
INK_SOFT   = RGBColor(0x4A, 0x55, 0x68)  # testo secondario
LINE       = RGBColor(0xC3, 0xCA, 0xD4)  # bordo chiaro
ACCENT     = RGBColor(0xA0, 0x17, 0x29)  # rosso su chiaro (AA)
ACCENT_BR  = RGBColor(0xC4, 0x1E, 0x3A)  # rosso brillante su navy
CREAM      = RGBColor(0xF5, 0xF1, 0xE8)  # testo su navy
CREAM_SOFT = RGBColor(0xC8, 0xC4, 0xBC)

SANS = "Segoe UI"
SERIF = "Georgia"

LOGO = "logo-eurisko-color.png"
_lw, _lh = Image.open(LOGO).size
LOGO_RATIO = _lw / _lh  # ~3.437

prs = Presentation()
prs.slide_width = Inches(13.333)
prs.slide_height = Inches(7.5)
SLIDE_W = prs.slide_width
SLIDE_H = prs.slide_height
BLANK = prs.slide_layouts[6]


def add_bg(slide, color):
    bg = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, SLIDE_W, SLIDE_H)
    bg.fill.solid(); bg.fill.fore_color.rgb = color
    bg.line.fill.background(); bg.shadow.inherit = False
    return bg


def add_rect(slide, left, top, width, height, color, line=None, line_w=0.75):
    sh = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, left, top, width, height)
    sh.fill.solid(); sh.fill.fore_color.rgb = color
    if line is None:
        sh.line.fill.background()
    else:
        sh.line.color.rgb = line; sh.line.width = Pt(line_w)
    sh.shadow.inherit = False
    return sh


def add_text(slide, text, left, top, width, height, *, font_size=18, bold=False,
             color=INK, align=PP_ALIGN.LEFT, anchor=MSO_ANCHOR.TOP, italic=False,
             font_name=SANS, line_spacing=None):
    tb = slide.shapes.add_textbox(left, top, width, height)
    tf = tb.text_frame; tf.word_wrap = True
    tf.margin_left = 0; tf.margin_right = 0; tf.margin_top = 0; tf.margin_bottom = 0
    tf.vertical_anchor = anchor
    for i, line in enumerate(text.split("\n")):
        p = tf.paragraphs[0] if i == 0 else tf.add_paragraph()
        p.alignment = align
        if line_spacing is not None:
            p.line_spacing = line_spacing
        r = p.add_run(); r.text = line
        r.font.size = Pt(font_size); r.font.bold = bold; r.font.italic = italic
        r.font.name = font_name; r.font.color.rgb = color
    return tb


def add_bullets(slide, bullets, left, top, width, height, *, font_size=20,
                color=INK, dash_color=ACCENT, line_spacing=1.2, space_after=10):
    tb = slide.shapes.add_textbox(left, top, width, height)
    tf = tb.text_frame; tf.word_wrap = True
    tf.margin_left = 0; tf.margin_right = 0
    for i, item in enumerate(bullets):
        p = tf.paragraphs[0] if i == 0 else tf.add_paragraph()
        p.alignment = PP_ALIGN.LEFT; p.line_spacing = line_spacing
        p.space_after = Pt(space_after)
        rd = p.add_run(); rd.text = "—  "
        rd.font.size = Pt(font_size); rd.font.color.rgb = dash_color
        rd.font.bold = True; rd.font.name = SANS
        r = p.add_run(); r.text = item
        r.font.size = Pt(font_size); r.font.color.rgb = color; r.font.name = SANS
    return tb


def add_accent_bar(slide, left, top, width=Inches(0.55), height=Inches(0.07), color=ACCENT):
    return add_rect(slide, left, top, width, height, color)


def add_eyebrow(slide, text, left, top, color=ACCENT):
    return add_text(slide, text.upper(), left, top, Inches(9), Inches(0.4),
                    font_size=12, color=color, bold=True)


def add_logo(slide, left, top, width_in):
    h = width_in / LOGO_RATIO
    slide.shapes.add_picture(LOGO, left, top, Inches(width_in), Inches(h))


def light_header(slide, eyebrow, title, *, title_size=40):
    add_bg(slide, PAPER)
    add_logo(slide, Inches(11.13), Inches(0.5), 1.55)
    add_eyebrow(slide, eyebrow, Inches(0.7), Inches(0.62))
    add_accent_bar(slide, Inches(0.7), Inches(1.02))
    add_text(slide, title, Inches(0.7), Inches(1.32), Inches(10.2), Inches(1.3),
             font_size=title_size, bold=True, color=INK)


def add_footer(slide, dark=False):
    c = CREAM_SOFT if dark else INK_SOFT
    add_text(slide, "Eurisko S.r.l.  ·  Sito istituzionale  ·  2026",
             Inches(0.7), Inches(7.06), Inches(9), Inches(0.3), font_size=10, color=c)


def add_slide_number(slide, n, total, dark=False):
    c = CREAM_SOFT if dark else INK_SOFT
    add_text(slide, "%02d / %02d" % (n, total), Inches(11.6), Inches(7.06),
             Inches(1.2), Inches(0.3), font_size=10, color=c, align=PP_ALIGN.RIGHT)


def notes(slide, txt):
    slide.notes_slide.notes_text_frame.text = txt


slides_data = []


# 1. Cover (light)
def s_cover(s):
    add_bg(s, PAPER)
    # banda slate decorativa a destra + quadrato accent
    add_rect(s, Inches(9.7), 0, Inches(3.633), SLIDE_H, BAND)
    add_rect(s, Inches(9.7), Inches(3.2), Inches(3.633), Inches(0.12), ACCENT)
    add_logo(s, Inches(0.7), Inches(0.75), 2.7)
    add_eyebrow(s, "Panoramica del sito  ·  presentazione ai soci", Inches(0.72), Inches(2.35))
    add_accent_bar(s, Inches(0.72), Inches(2.8), width=Inches(1.2), height=Inches(0.1))
    add_text(s, "Il nuovo sito\nistituzionale.", Inches(0.7), Inches(3.15),
             Inches(9), Inches(2.0), font_size=58, bold=True, color=INK)
    add_text(s, "Vetrina di posizionamento, motore di lead generation e recruiting.\nBilingue, accessibile, conforme.",
             Inches(0.72), Inches(5.55), Inches(8.6), Inches(1.2),
             font_size=20, color=INK_SOFT, italic=True, font_name=SERIF)
    add_text(s, "Eurisko S.r.l.  ·  2026", Inches(0.72), Inches(6.85),
             Inches(8), Inches(0.4), font_size=13, color=ACCENT, bold=True)

slides_data.append(("Cover", s_cover, False,
    "Apri introducendo il sito come asset dell'azienda: non una semplice vetrina ma uno strumento commerciale e di immagine. Tono diretto."))


# 2. Obiettivo
def s_obiettivi(s):
    light_header(s, "01 · Obiettivo", "Perché questo sito.")
    add_bullets(s, [
        "Allineare la presenza online al posizionamento premium B2B di Eurisko nella consulenza SAP.",
        "Aprire il bacino oltre l'Italia con una versione inglese completa, non una traduzione di facciata.",
        "Far lavorare il sito come strumento commerciale: lead generation, recruiting, content marketing.",
        "Stack moderno e indipendente: nessun CMS o plugin di terze parti da mantenere.",
        "Rispetto pieno di GDPR, accessibilità WCAG 2.1 AA e best practice SEO.",
    ], Inches(0.7), Inches(2.7), Inches(12), Inches(4.2), font_size=20)

slides_data.append(("Obiettivo", s_obiettivi, False,
    "Cinque punti. Insistere che NON è solo una vetrina ma un asset commerciale. La versione EN apre il mercato europeo per S/4HANA e AMS."))


# 3. Numeri
def s_numeri(s):
    light_header(s, "02 · I numeri", "In sintesi.")
    stats = [("74", "pagine\npubblicate"), ("2", "lingue complete\nIT + EN"),
             ("5", "moduli SAP\nFI·CO·MM·SD·FSCM"), ("10", "settori\nindustriali")]
    col_w = Inches(2.8); gap = Inches(0.28)
    total_w = col_w * 4 + gap * 3
    start_x = int((SLIDE_W - total_w) / 2)
    for i, (num, label) in enumerate(stats):
        x = start_x + int(col_w + gap) * i
        add_rect(s, x, Inches(3.2), col_w, Inches(2.7), PAPER_ALT, line=LINE)
        add_text(s, num, x, Inches(3.4), col_w, Inches(1.5), font_size=80,
                 bold=True, color=ACCENT, align=PP_ALIGN.CENTER)
        add_text(s, label, x, Inches(5.0), col_w, Inches(0.9), font_size=14,
                 color=INK_SOFT, align=PP_ALIGN.CENTER)
    add_text(s, "Costi infrastrutturali a regime: circa 15 € l'anno.",
             Inches(0.7), Inches(6.35), Inches(12), Inches(0.4), font_size=14,
             color=ACCENT, italic=True, align=PP_ALIGN.CENTER, font_name=SERIF)

slides_data.append(("Numeri", s_numeri, False,
    "I numeri parlano da soli: 74 pagine = sito enterprise-grade. 5 moduli e 10 settori = ampiezza commerciale e leva SEO."))


# 4. Struttura
def s_struttura(s):
    light_header(s, "03 · Struttura del sito", "Cosa c'è dentro.")
    cols = [
        ("Cosa facciamo", ["Consulenza SAP", "Soluzioni", "Migrazione S/4HANA",
                            "AMS — Application Mgmt"]),
        ("Moduli SAP", ["Finance (FI)", "Controlling (CO)", "Material Mgmt (MM)",
                        "Sales & Distribution (SD)", "FSCM"]),
        ("Settori", ["Aerospazio · Automotive", "Chimica · Food & Beverage",
                     "Industriale · Retail", "Public Sector · Travel",
                     "Comm. & Media · Utilities"]),
        ("Azienda", ["La nostra visione", "Portfolio progetti", "Lavora con noi",
                     "Glossari SAP e progetto", "Contatti"]),
    ]
    col_w = Inches(2.95); gap = Inches(0.15)
    total_w = col_w * 4 + gap * 3
    start_x = int((SLIDE_W - total_w) / 2)
    for i, (title, items) in enumerate(cols):
        x = start_x + int(col_w + gap) * i
        add_text(s, title, x, Inches(2.85), col_w, Inches(0.5), font_size=18,
                 bold=True, color=ACCENT)
        add_accent_bar(s, x, Inches(3.4), width=Inches(0.4), height=Inches(0.04))
        add_text(s, "\n".join(items), x, Inches(3.65), col_w, Inches(3.4),
                 font_size=15, color=INK, line_spacing=1.0)

slides_data.append(("Struttura", s_struttura, False,
    "Quattro aree tematiche. Ogni voce è una pagina dedicata e ricca di contenuto, non un placeholder. I glossari sono leva SEO organica."))


# 5. Profondità contenuti
def s_profondita(s):
    light_header(s, "04 · Profondità di contenuto", "Pagine verticali, non landing.")
    add_bullets(s, [
        "Ogni settore ha una pagina dedicata: esigenze specifiche, esempi, moduli SAP rilevanti, casi d'uso.",
        "Ogni modulo SAP ha una pagina con panoramica funzionale, scenari tipici, deliverable Eurisko, CTA.",
        "AMS e Migrazione S/4HANA come pagine-prodotto: i due servizi a maggior valore.",
        "Portfolio con casi concreti, organizzati per settore.",
        "Due glossari (SAP e di progetto): asset di posizionamento organico e supporto alla vendita.",
    ], Inches(0.7), Inches(2.7), Inches(12), Inches(4.2), font_size=20)

slides_data.append(("Profondita", s_profondita, False,
    "Ogni pagina è contenutistica, non vuota. Una pagina settore vale centinaia di parole rilevanti: buon segnale per Google e per il cliente."))


# 6. Bilingue
def s_bilingue(s):
    light_header(s, "05 · Strategia internazionale", "Bilingue completo, non superficiale.")
    add_bullets(s, [
        "Versione EN integralmente parallela alla IT: circa 37 pagine per lingua.",
        "Switch lingua su ogni pagina, mantiene il contesto (es. Cosa facciamo ↔ What we do).",
        "Hreflang dichiarato a Google: indicizzazione corretta delle coppie linguistiche.",
        "Traduzione adattata, non automatica: terminologia SAP allineata al lessico anglofono.",
        "Apre il sito a clienti europei e gruppi multinazionali con HQ fuori Italia.",
    ], Inches(0.7), Inches(2.7), Inches(12), Inches(4.2), font_size=20)

slides_data.append(("Bilingue", s_bilingue, False,
    "La versione EN non è di facciata: è un investimento che apre opportunità con multinazionali con sede europea fuori Italia."))


# 7. Lead generation
def s_form(s):
    light_header(s, "06 · Lead generation & recruiting", "Due canali attivi.")
    col_w = Inches(5.8); x1 = Inches(0.7); x2 = Inches(6.85); y = Inches(2.75)
    add_text(s, "Form contatti commerciali", x1, y, col_w, Inches(0.5),
             font_size=21, bold=True, color=ACCENT)
    add_accent_bar(s, x1, Inches(3.32), width=Inches(0.4), height=Inches(0.04))
    add_text(s,
             "•  Campi essenziali · oggetto strutturato\n"
             "•  Consenso privacy / GDPR esplicito\n"
             "•  Honeypot anti-bot + reCAPTCHA Google\n"
             "•  Invio via email con Resend (funzione serverless)\n"
             "•  Pagina di conferma dedicata",
             x1, Inches(3.6), col_w, Inches(3.0), font_size=16, color=INK, line_spacing=1.15)
    add_text(s, "Form candidature", x2, y, col_w, Inches(0.5),
             font_size=21, bold=True, color=ACCENT)
    add_accent_bar(s, x2, Inches(3.32), width=Inches(0.4), height=Inches(0.04))
    add_text(s,
             "•  Anagrafica, telefono con prefisso, posizione\n"
             "•  Anni di esperienza SAP · LinkedIn\n"
             "•  Permesso di lavoro · categorie protette (L. 68/99)\n"
             "•  Upload CV in allegato · consenso GDPR\n"
             "•  Email di conferma automatica al candidato",
             x2, Inches(3.6), col_w, Inches(3.0), font_size=16, color=INK, line_spacing=1.15)

slides_data.append(("Form", s_form, False,
    "Il sito non è passivo: due canali alimentano commerciale e HR. La conformità lavoristica italiana (categorie protette, permesso di lavoro) è gestita nel form."))


# 8. UX / Mobile
def s_ux(s):
    light_header(s, "07 · Esperienza utente", "Mobile-first, non mobile-after.")
    add_bullets(s, [
        "Layout responsive su desktop, tablet e mobile.",
        "Menu compatto con sotto-livelli ad accordion sul mobile.",
        "Animazioni curate sulle hero (rivelazione progressiva, profondità).",
        "Animazioni disattivate in automatico se l'utente le riduce dal sistema (accessibilità).",
        "Performance: CSS e JS minificati, immagini ottimizzate, caricamento differito.",
        "Ricerca interna al sito con scorciatoie da tastiera.",
    ], Inches(0.7), Inches(2.7), Inches(12), Inches(4.2), font_size=18)

slides_data.append(("UX", s_ux, False,
    "Gran parte del traffico B2B arriva da mobile. Performance reale e usabilità contano più del solo effetto scenico della home."))


# 9. Architettura tecnica
def s_tecnico(s):
    light_header(s, "08 · Architettura tecnica", "Stack semplice. Affidabile. Senza lock-in.", title_size=36)
    rows = [
        ("Sorgente", "HTML, CSS e JavaScript puri. Nessun framework, CMS o database."),
        ("Hosting", "Vercel · CDN globale · HTTPS automatico · deploy da Git."),
        ("Versionamento", "Repository GitHub privato · cronologia completa · backup."),
        ("Form & email", "Resend via funzioni serverless dedicate: invio affidabile alle mailbox interne."),
        ("Sicurezza", "Header HTTP robusti (HSTS, CSP, anti-clickjacking) + reCAPTCHA e honeypot."),
        ("Analytics", "Predisposto per Google Analytics e Search Console, attento alla privacy."),
    ]
    y = 2.75
    for label, val in rows:
        add_text(s, label, Inches(0.7), Inches(y), Inches(2.7), Inches(0.4),
                 font_size=15, bold=True, color=ACCENT)
        add_text(s, val, Inches(3.5), Inches(y), Inches(9.4), Inches(0.5),
                 font_size=15, color=INK)
        y += 0.62

slides_data.append(("Tecnico", s_tecnico, False,
    "Concetto chiave: NO LOCK-IN. Il sito è statico, spostabile su qualsiasi hosting in poco tempo; i form sono ricollegabili ad altri servizi. Dipendenze e costi minimi."))


# 10. SEO
def s_seo(s):
    light_header(s, "09 · SEO & content marketing", "Indicizzazione costruita on-page.", title_size=38)
    add_bullets(s, [
        "Meta description, Open Graph e Twitter Card configurati su ogni pagina.",
        "Sitemap XML, robots.txt e dati strutturati JSON-LD (breadcrumb).",
        "Hreflang IT/EN per indicare a Google le coppie di pagine equivalenti.",
        "Keyword mirate: \"consulenza SAP\", \"migrazione S/4HANA\", \"AMS SAP\", per modulo e settore.",
        "Glossari SAP e di progetto come asset organico per le ricerche long-tail.",
        "Obiettivo Lighthouse 90+ su SEO, accessibilità e best practice.",
    ], Inches(0.7), Inches(2.6), Inches(12), Inches(4.3), font_size=18)

slides_data.append(("SEO", s_seo, False,
    "I risultati SEO crescono nel tempo: il contenuto è già denso e localizzato sulle keyword target. Search Console misura l'andamento."))


# 11. Accessibilità & GDPR
def s_compliance(s):
    light_header(s, "10 · Accessibilità & GDPR", "Conformità non opzionale.")
    col_w = Inches(5.8); x1 = Inches(0.7); x2 = Inches(6.85); y = Inches(2.75)
    add_text(s, "Accessibilità — WCAG 2.1 AA", x1, y, col_w, Inches(0.5),
             font_size=19, bold=True, color=ACCENT)
    add_accent_bar(s, x1, Inches(3.32), width=Inches(0.4), height=Inches(0.04))
    add_text(s,
             "•  Skip link e navigazione completa da tastiera\n"
             "•  Ruoli semantici e aria-label\n"
             "•  Contrasti conformi · alt text su tutte le immagini\n"
             "•  Rispetto delle preferenze di sistema (riduzione movimento)\n"
             "•  Pagina Dichiarazione di Accessibilità",
             x1, Inches(3.6), col_w, Inches(3.0), font_size=15, color=INK, line_spacing=1.15)
    add_text(s, "GDPR / Compliance", x2, y, col_w, Inches(0.5),
             font_size=19, bold=True, color=ACCENT)
    add_accent_bar(s, x2, Inches(3.32), width=Inches(0.4), height=Inches(0.04))
    add_text(s,
             "•  Cookie banner conforme · consenso opt-in granulare\n"
             "•  Privacy Policy · Cookie Policy · Note Legali\n"
             "•  Termini di Utilizzo · Mappa del Sito\n"
             "•  Consenso esplicito sui form · finalità delimitate\n"
             "•  Nessun tracciamento di terze parti senza consenso",
             x2, Inches(3.6), col_w, Inches(3.0), font_size=15, color=INK, line_spacing=1.15)

slides_data.append(("Compliance", s_compliance, False,
    "Accessibilità WCAG 2.1 AA e GDPR non sono opzionali: il sito è predisposto per reggere un audit. Base legale chiara per ogni form."))


# 12. Costi
def s_costi(s):
    light_header(s, "11 · Costi & manutenzione", "Spesa annua contenuta.")
    rows = [
        ("Dominio (1 anno)", "~ 15 €", "Rinnovo annuale"),
        ("Hosting Vercel", "0 €", "Piano free sufficiente per traffico B2B"),
        ("GitHub", "0 €", "Repository privato gratuito"),
        ("Resend (email)", "0 €", "Piano free per i volumi attuali"),
        ("Google reCAPTCHA", "0 €", "Servizio gratuito"),
        ("Totale a regime", "~ 15 € / anno", "Manutenzione gestita internamente"),
    ]
    y = 2.7
    for i, (label, price, note) in enumerate(rows):
        last = (i == len(rows) - 1)
        if last:
            add_rect(s, Inches(0.6), Inches(y - 0.06), Inches(12.13), Inches(0.62), PAPER_ALT, line=LINE)
        add_text(s, label, Inches(0.8), Inches(y), Inches(4.4), Inches(0.4),
                 font_size=16, bold=last, color=(ACCENT if last else INK))
        add_text(s, price, Inches(5.4), Inches(y), Inches(3.0), Inches(0.4),
                 font_size=16, bold=True, color=ACCENT)
        add_text(s, note, Inches(8.5), Inches(y), Inches(4.2), Inches(0.4),
                 font_size=13, color=INK_SOFT, italic=True)
        y += 0.62

slides_data.append(("Costi", s_costi, False,
    "Numero che colpisce: circa 15 €/anno fissi. Nessun canone software, nessuna dipendenza onerosa; gli aggiornamenti si fanno internamente via repository."))


# 13. Prossimi sviluppi
def s_roadmap(s):
    light_header(s, "12 · Evoluzione", "Come cresce il sito.")
    phases = [
        ("In corso", [
            "Monitoraggio analytics e Search Console",
            "Prime ottimizzazioni sui contenuti",
            "Raccolta feedback commerciale e HR",
        ]),
        ("Breve termine", [
            "Pubblicazione di casi studio reali (con consenso clienti)",
            "Primi articoli di approfondimento",
            "Affinamento keyword e meta",
        ]),
        ("Medio-lungo", [
            "A/B test su CTA e headline",
            "Espansione glossari e sezione insight",
            "Eventuale newsletter / integrazione LinkedIn jobs",
        ]),
    ]
    col_w = Inches(4.05); gap = Inches(0.15)
    total_w = col_w * 3 + gap * 2
    start_x = int((SLIDE_W - total_w) / 2)
    for i, (title, items) in enumerate(phases):
        x = start_x + int(col_w + gap) * i
        add_rect(s, x, Inches(2.8), col_w, Inches(3.9), PAPER_ALT, line=LINE)
        add_text(s, title, x + Inches(0.25), Inches(3.0), col_w - Inches(0.5),
                 Inches(0.5), font_size=20, bold=True, color=ACCENT)
        add_accent_bar(s, x + Inches(0.25), Inches(3.55), width=Inches(0.4), height=Inches(0.04))
        add_text(s, "\n".join("•  " + it for it in items), x + Inches(0.25),
                 Inches(3.8), col_w - Inches(0.5), Inches(2.8), font_size=14,
                 color=INK, line_spacing=1.2)

slides_data.append(("Evoluzione", s_roadmap, False,
    "Il sito è uno strumento vivo: le prossime attività sono incrementali e guidate dalle priorità commerciali, non da vincoli tecnici."))


# 14. Q&A
def s_qa(s):
    light_header(s, "13 · Q&A", "Domande probabili.", title_size=38)
    qa = [
        ("Quanto siamo competitivi sul SEO?",
         "Si misura nel tempo. Il contenuto è già denso e localizzato sulle keyword target."),
        ("Possiamo modificare i testi senza uno sviluppatore?",
         "Sì: modifica del file e pubblicazione via repository. Posso preparare una guida operativa."),
        ("Cosa succede se Vercel o Resend cambiano?",
         "Sito statico → trasferibile su qualsiasi hosting; i form sono ricollegabili ad altri servizi. Zero lock-in."),
        ("I dati dei candidati sono al sicuro?",
         "Invio in HTTPS, nessun database lato nostro: i CV arrivano alla mailbox HR. Consenso GDPR esplicito, conservazione 12 mesi."),
        ("Si può aggiungere un'area riservata clienti?",
         "Sì, ma è un progetto a parte (autenticazione + backend), da valutare in base al beneficio."),
    ]
    y = 2.65
    for q, a in qa:
        add_text(s, "?   " + q, Inches(0.7), Inches(y), Inches(12), Inches(0.4),
                 font_size=15, bold=True, color=ACCENT)
        add_text(s, a, Inches(1.0), Inches(y + 0.38), Inches(11.6), Inches(0.5),
                 font_size=13.5, color=INK_SOFT, italic=True)
        y += 0.85

slides_data.append(("Q&A", s_qa, False,
    "Cinque domande tipiche con risposte pronte. Se i soci ne pongono altre, prendere nota e rispondere a seguire."))


# 15. Chiusura (navy, come il footer del sito)
def s_closing(s):
    add_bg(s, NAVY)
    glow = s.shapes.add_shape(MSO_SHAPE.OVAL, Inches(9.8), Inches(4.4), Inches(6), Inches(6))
    glow.fill.solid(); glow.fill.fore_color.rgb = ACCENT_BR
    glow.line.fill.background(); glow.shadow.inherit = False
    add_rect(s, Inches(10.8), Inches(-1.4), Inches(3), Inches(3), NAVY_SOFT)
    add_eyebrow(s, "Eurisko", Inches(0.72), Inches(2.0), color=ACCENT_BR)
    add_accent_bar(s, Inches(0.72), Inches(2.5), width=Inches(1.2), height=Inches(0.1), color=ACCENT_BR)
    add_text(s, "Smart, functional, dynamic,\nproactive, agile.", Inches(0.7),
             Inches(2.9), Inches(12), Inches(2.2), font_size=52, bold=True, color=CREAM)
    add_text(s, "Il tuo partner SAP.", Inches(0.72), Inches(5.35), Inches(12),
             Inches(0.7), font_size=22, color=ACCENT_BR, italic=True, font_name=SERIF)
    add_text(s, "Grazie.  ·  Domande?", Inches(0.72), Inches(6.6), Inches(12),
             Inches(0.5), font_size=14, color=CREAM_SOFT)

slides_data.append(("Chiusura", s_closing, True,
    "Slide finale. La tagline aziendale chiude la presentazione. Lasciarla a video durante il Q&A."))


# ===== build =====
total = len(slides_data)
for i, (title, builder, dark, note) in enumerate(slides_data, start=1):
    slide = prs.slides.add_slide(BLANK)
    builder(slide)
    if i not in (1, total):
        add_slide_number(slide, i, total, dark=dark)
        add_footer(slide, dark=dark)
    notes(slide, note)

out = "Eurisko-Sito-Panoramica.pptx"
prs.save(out)
print("Generato:", out, "·", total, "slide")
