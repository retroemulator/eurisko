"""
Generate English version of Codice di Etica Aziendale Eurisko -> Code of Business Ethics Eurisko.
Uses reportlab to create a brand-coherent PDF.
"""

from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.colors import HexColor, white
from reportlab.lib.units import cm, mm
from reportlab.lib.enums import TA_LEFT, TA_CENTER, TA_JUSTIFY
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, PageBreak, Table, TableStyle,
    KeepTogether, Image, ListFlowable, ListItem
)

# Brand palette
NAVY = HexColor("#0A1628")
INK = HexColor("#0A1628")
INK_SOFT = HexColor("#4A5568")
INK_MUTE = HexColor("#6B7280")
CREAM = HexColor("#F5F1E8")
CREAM_LIGHT = HexColor("#FAFAF7")
ACCENT = HexColor("#C41E3A")
LINE_SOFT = HexColor("#E5E7EB")

PAGE_W, PAGE_H = A4

# Styles
styles = getSampleStyleSheet()

def make_styles():
    s = {}
    s['cover_eyebrow'] = ParagraphStyle('cover_eyebrow', parent=styles['Normal'],
        fontName='Helvetica', fontSize=10, textColor=ACCENT, leading=14,
        spaceAfter=12, alignment=TA_LEFT, letterSpacing=4)
    s['cover_title'] = ParagraphStyle('cover_title', parent=styles['Normal'],
        fontName='Helvetica-Bold', fontSize=56, textColor=INK, leading=60,
        spaceAfter=8, alignment=TA_LEFT)
    s['cover_subtitle'] = ParagraphStyle('cover_subtitle', parent=styles['Normal'],
        fontName='Helvetica-Oblique', fontSize=14, textColor=INK_SOFT, leading=20,
        spaceAfter=24, alignment=TA_LEFT)
    s['cover_caption'] = ParagraphStyle('cover_caption', parent=styles['Normal'],
        fontName='Helvetica', fontSize=10, textColor=INK_MUTE, leading=14,
        alignment=TA_LEFT)

    s['section_eyebrow'] = ParagraphStyle('section_eyebrow', parent=styles['Normal'],
        fontName='Helvetica-Bold', fontSize=9, textColor=ACCENT, leading=14,
        spaceBefore=6, spaceAfter=8, alignment=TA_LEFT)
    s['h1'] = ParagraphStyle('h1', parent=styles['Normal'],
        fontName='Helvetica-Bold', fontSize=28, textColor=INK, leading=32,
        spaceBefore=4, spaceAfter=16, alignment=TA_LEFT)
    s['h2'] = ParagraphStyle('h2', parent=styles['Normal'],
        fontName='Helvetica-Bold', fontSize=18, textColor=INK, leading=22,
        spaceBefore=18, spaceAfter=10, alignment=TA_LEFT)
    s['h3'] = ParagraphStyle('h3', parent=styles['Normal'],
        fontName='Helvetica-Bold', fontSize=13, textColor=INK, leading=18,
        spaceBefore=14, spaceAfter=6, alignment=TA_LEFT)
    s['lede'] = ParagraphStyle('lede', parent=styles['Normal'],
        fontName='Helvetica-Oblique', fontSize=12, textColor=INK_SOFT,
        leading=18, spaceAfter=12, alignment=TA_LEFT)
    s['body'] = ParagraphStyle('body', parent=styles['Normal'],
        fontName='Helvetica', fontSize=10.5, textColor=INK, leading=16,
        spaceAfter=8, alignment=TA_JUSTIFY)
    s['bullet'] = ParagraphStyle('bullet', parent=styles['Normal'],
        fontName='Helvetica', fontSize=10, textColor=INK, leading=15,
        spaceAfter=4, leftIndent=14, bulletIndent=2, alignment=TA_LEFT)
    s['box_label'] = ParagraphStyle('box_label', parent=styles['Normal'],
        fontName='Helvetica-Bold', fontSize=8, textColor=ACCENT, leading=12,
        spaceAfter=4, alignment=TA_LEFT)
    s['box_title'] = ParagraphStyle('box_title', parent=styles['Normal'],
        fontName='Helvetica-Bold', fontSize=12, textColor=INK, leading=16,
        spaceAfter=8, alignment=TA_LEFT)
    s['box_body'] = ParagraphStyle('box_body', parent=styles['Normal'],
        fontName='Helvetica', fontSize=10, textColor=INK, leading=15,
        spaceAfter=4, alignment=TA_LEFT)
    s['quote_em'] = ParagraphStyle('quote_em', parent=styles['Normal'],
        fontName='Helvetica-Oblique', fontSize=11, textColor=INK_SOFT, leading=16,
        spaceBefore=6, spaceAfter=10, leftIndent=12, alignment=TA_LEFT)
    s['big_section_eyebrow'] = ParagraphStyle('big_section_eyebrow', parent=styles['Normal'],
        fontName='Helvetica-Bold', fontSize=11, textColor=ACCENT, leading=16,
        spaceAfter=10, alignment=TA_LEFT)
    s['big_section_title'] = ParagraphStyle('big_section_title', parent=styles['Normal'],
        fontName='Helvetica-Bold', fontSize=44, textColor=INK, leading=50,
        spaceAfter=20, alignment=TA_LEFT)
    s['num_marker'] = ParagraphStyle('num_marker', parent=styles['Normal'],
        fontName='Helvetica-Bold', fontSize=44, textColor=ACCENT, leading=50,
        spaceAfter=4, alignment=TA_LEFT)
    s['behavior_title'] = ParagraphStyle('behavior_title', parent=styles['Normal'],
        fontName='Helvetica-Bold', fontSize=22, textColor=INK, leading=28,
        spaceAfter=16, alignment=TA_LEFT)
    s['footer_thanks_big'] = ParagraphStyle('footer_thanks_big', parent=styles['Normal'],
        fontName='Helvetica-Bold', fontSize=36, textColor=INK, leading=42,
        spaceAfter=12, alignment=TA_CENTER)
    s['footer_thanks_sub'] = ParagraphStyle('footer_thanks_sub', parent=styles['Normal'],
        fontName='Helvetica-Oblique', fontSize=13, textColor=INK_SOFT, leading=18,
        spaceAfter=24, alignment=TA_CENTER)
    s['toc_entry'] = ParagraphStyle('toc_entry', parent=styles['Normal'],
        fontName='Helvetica', fontSize=11, textColor=INK, leading=20,
        spaceAfter=4, alignment=TA_LEFT)
    s['toc_section'] = ParagraphStyle('toc_section', parent=styles['Normal'],
        fontName='Helvetica-Bold', fontSize=10, textColor=ACCENT, leading=16,
        spaceBefore=16, spaceAfter=8, alignment=TA_LEFT)
    return s

S = make_styles()


def header_footer(canvas, doc):
    """Draw page header (top-right) and footer (bottom-right) on each page except cover."""
    if doc.page == 1:
        return
    canvas.saveState()
    # Top header
    canvas.setFont('Helvetica', 8)
    canvas.setFillColor(INK_MUTE)
    canvas.drawString(2 * cm, PAGE_H - 1.2 * cm, "Code of Business Ethics · Eurisko S.r.l.")
    # Bottom footer
    canvas.setFont('Helvetica', 8)
    canvas.setFillColor(INK_MUTE)
    canvas.drawRightString(PAGE_W - 2 * cm, 1.2 * cm,
                            f"Eurisko S.r.l.  ·  2026 Edition  ·  {doc.page}")
    # Divider lines
    canvas.setStrokeColor(LINE_SOFT)
    canvas.setLineWidth(0.5)
    canvas.line(2 * cm, PAGE_H - 1.5 * cm, PAGE_W - 2 * cm, PAGE_H - 1.5 * cm)
    canvas.line(2 * cm, 1.5 * cm, PAGE_W - 2 * cm, 1.5 * cm)
    canvas.restoreState()


def cover_page(canvas, doc):
    """Custom drawing for cover page (page 1)."""
    canvas.saveState()
    # Full bg cream
    canvas.setFillColor(CREAM_LIGHT)
    canvas.rect(0, 0, PAGE_W, PAGE_H, fill=1, stroke=0)
    # Side accent bar
    canvas.setFillColor(ACCENT)
    canvas.rect(0, 0, 0.8 * cm, PAGE_H, fill=1, stroke=0)
    # Eyebrow
    canvas.setFillColor(ACCENT)
    canvas.setFont('Helvetica-Bold', 9)
    canvas.drawString(3 * cm, PAGE_H - 5 * cm, "W E L C O M E   T O   T H E")
    # Title
    canvas.setFillColor(INK)
    canvas.setFont('Helvetica-Bold', 72)
    canvas.drawString(3 * cm, PAGE_H - 9 * cm, "CODE OF")
    canvas.drawString(3 * cm, PAGE_H - 11.5 * cm, "BUSINESS")
    canvas.drawString(3 * cm, PAGE_H - 14 * cm, "ETHICS")
    # Subtitle
    canvas.setFillColor(INK_SOFT)
    canvas.setFont('Helvetica-Oblique', 14)
    canvas.drawString(3 * cm, PAGE_H - 16 * cm,
                      "Your guide to responsible conduct, every day.")
    # Caption bottom
    canvas.setFillColor(INK_MUTE)
    canvas.setFont('Helvetica', 10)
    canvas.drawString(3 * cm, 2.5 * cm, "Eurisko S.r.l.  ·  2026 Edition")
    canvas.restoreState()


def bullets(items):
    """Return ListFlowable from list of bullet text items."""
    return ListFlowable(
        [ListItem(Paragraph(it, S['bullet']), leftIndent=14, value='bullet')
         for it in items],
        bulletType='bullet', bulletColor=ACCENT, bulletFontSize=8,
        leftIndent=12, bulletFontName='Helvetica-Bold'
    )


def info_box(label, title, body_flowables):
    """Render a tinted info box with label, title, body."""
    cell = []
    cell.append(Paragraph(label, S['box_label']))
    cell.append(Paragraph(title, S['box_title']))
    for fl in body_flowables:
        cell.append(fl)
    t = Table([[cell]], colWidths=[16 * cm])
    t.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), CREAM_LIGHT),
        ('BOX', (0, 0), (-1, -1), 0.5, LINE_SOFT),
        ('LINEBEFORE', (0, 0), (0, 0), 2, ACCENT),
        ('LEFTPADDING', (0, 0), (-1, -1), 14),
        ('RIGHTPADDING', (0, 0), (-1, -1), 14),
        ('TOPPADDING', (0, 0), (-1, -1), 12),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 12),
    ]))
    return t


def section_header(eyebrow, h1_text):
    return [
        Paragraph(eyebrow, S['section_eyebrow']),
        Paragraph(h1_text, S['h1']),
    ]


# ============================================================
# Content (English translation of Codice di Etica Aziendale)
# ============================================================

def build_story():
    story = []

    # Page 1 — cover (handled by cover_page canvas hook, just trigger page break)
    story.append(PageBreak())

    # Page 2 — Index
    story.append(Paragraph("I N D E X", S['section_eyebrow']))
    story.append(Paragraph("Contents", S['h1']))
    story.append(Spacer(1, 12))
    story.append(Paragraph("I N T R O D U C T I O N", S['toc_section']))
    toc_intro = [
        ("Welcome letter", "03"),
        ("Our Code of Business Ethics", "04"),
        ("Your responsibilities", "05"),
        ("Making the right decisions", "06"),
        ("How to raise concerns", "07"),
    ]
    for title, page in toc_intro:
        dots = "." * max(2, 90 - len(title))
        story.append(Paragraph(f"{title} {dots} {page}", S['toc_entry']))
    story.append(Paragraph("T H E   S I X   F U N D A M E N T A L   B E H A V I O U R S", S['toc_section']))
    toc_six = [
        ("01  Conduct matters", "09"),
        ("02  Respect the law", "11"),
        ("03  Create value for our clients", "13"),
        ("04  Protect people, information and the company", "15"),
        ("05  Conduct business activities responsibly", "18"),
        ("06  Be a good citizen", "20"),
    ]
    for title, page in toc_six:
        dots = "." * max(2, 90 - len(title))
        story.append(Paragraph(f"{title} {dots} {page}", S['toc_entry']))
    story.append(PageBreak())

    # Page 3 — Acting with integrity / welcome letter
    story += section_header("A C T I N G   W I T H", "INTEGRITY")
    story.append(Paragraph("Welcome to the Eurisko S.r.l. Code of Business Ethics.", S['h3']))
    story.append(Paragraph(
        "At Eurisko, our daily commitment is to do the right thing. Since we began building this firm "
        "in 2002, we have shown that it is possible to grow by delivering real value to our clients, "
        "real opportunities to our people, and by staying faithful to a high ethical standard.",
        S['body']))
    story.append(Paragraph(
        "We are an organisational and technology consulting firm: our work enters our clients' most "
        "sensitive processes, accompanies their transformations, and touches their data and strategic "
        "decisions. For this reason, integrity is not an abstract value to us, but an operational "
        "condition: it is what allows clients to entrust us with their business, colleagues to trust one "
        "another, and ourselves to look with pride at the work we do.",
        S['body']))
    story.append(Paragraph(
        "This Code exists to translate our principles &mdash; vision, goal, method &mdash; into concrete "
        "behaviours. It does not replace common sense, but guides it. It does not eliminate difficult "
        "situations, but provides a shared framework to address them. We ask you to read it carefully, "
        "make it your own, and above all apply it: in your relationships with colleagues, with clients, "
        "with suppliers, and with the communities in which we live and work.",
        S['body']))
    story.append(Paragraph(
        "Our Code is more than a document. It is what we believe in, it is the way we work, it is the way "
        "we want to be recognised in the market. It is the concrete expression of our philosophy: "
        "<i>thinking outside the box and treating others with the same respect you would expect to "
        "receive.</i>",
        S['body']))
    story.append(Spacer(1, 8))
    story.append(Paragraph("The Management<br/>Eurisko S.r.l.", S['body']))
    story.append(PageBreak())

    # Page 4 — Our Code of Business Ethics
    story += section_header("O U R   C O D E", "Our Code of Business Ethics")
    story.append(Paragraph(
        "Our Code of Business Ethics is grounded in our values, provides extensive detail on expected "
        "behaviours, and guides our culture of compliance, ethical conduct and accountability.",
        S['body']))
    story.append(Paragraph(
        "The Code begins with a simple statement: we always act with integrity and in compliance with "
        "the law. Beyond being the right thing to do and protecting Eurisko, acting with integrity "
        "improves our performance, reflects our personality as a firm, and enables us to attract and "
        "retain the best talents and the best clients.",
        S['body']))
    story.append(Paragraph("Our core values", S['h3']))
    story.append(Paragraph(
        "Three pillars guide our daily work and our relationship with clients, and four promises define "
        "how we behave every day.",
        S['body']))
    story.append(info_box(
        "T H E   T H R E E   P I L L A R S",
        "Vision  ·  Goal  ·  Method",
        [
            bullets([
                "<b>Vision</b> &mdash; We anticipate signals of change in the market and react promptly, walking alongside the client in every need and opportunity for development.",
                "<b>Goal</b> &mdash; We provide the client with what is needed to run the core of their business, proposing tailored solutions grounded in real business processes.",
                "<b>Method</b> &mdash; Through motivated professionals with deep product knowledge, we guide the client by defining together the most efficient path to the goal.",
            ])
        ]))
    story.append(Spacer(1, 10))
    story.append(info_box(
        "T H E   F O U R   P R O M I S E S",
        "One way of working",
        [
            bullets([
                "<b>We are agile and innovative</b> &mdash; We adapt quickly to change and bring pragmatic innovation to every project.",
                "<b>We are customer centric</b> &mdash; The client is at the centre: every technical and methodological choice stems from real business needs.",
                "<b>We care for the future</b> &mdash; We build solutions that last, mindful of people and the evolution of technology.",
                "<b>We win together</b> &mdash; We work as one team with the client: project success is a shared result.",
            ])
        ]))
    story.append(Paragraph("Regulatory framework of reference", S['h3']))
    story.append(Paragraph(
        "This Code operates within the Italian and European regulatory framework applicable to "
        "Eurisko's activities. In particular, it forms an integral part and a precondition of the "
        "Organisation, Management and Control Model adopted pursuant to Italian Legislative Decree "
        "231/2001 (administrative liability of legal entities). The Code also incorporates the "
        "principles of personal data protection legislation (EU Regulation 2016/679 &mdash; GDPR and "
        "Italian Legislative Decree 196/2003 as amended), Italian labour law, and applicable "
        "anti-corruption laws (in particular Italian Law 190/2012 and Article 2635 of the Italian Civil "
        "Code).",
        S['body']))
    story.append(PageBreak())

    # Page 5 — Your responsibilities
    story += section_header("Y O U R   R O L E", "Your responsibilities")
    story.append(Paragraph("Who must comply with the Code", S['h3']))
    story.append(Paragraph(
        "This Code applies to all Eurisko personnel: directors, managers, employees and collaborators "
        "of any kind. In addition, external consultants, interns, trainees and any third party acting in "
        "the name or on behalf of Eurisko are required to abide by the principles of the Code in carrying "
        "out their activities.",
        S['body']))
    story.append(Paragraph("Acting ethically and respecting the law, the Code and company procedures", S['h3']))
    story.append(Paragraph(
        "Each of us is personally responsible for always acting ethically and respecting the law, the "
        "Code of Business Ethics, and Eurisko's policies and procedures. Violations damage the "
        "relationship of trust with the company and with clients and may result in disciplinary action "
        "&mdash; including termination of employment or collaboration &mdash; as well as possible "
        "individual civil and criminal liability.",
        S['body']))
    story.append(Paragraph(
        "Eurisko's values are consistent and applicable in any context. We recognise that certain "
        "practices, even when well established, may violate our ethics: in such cases, doing the right "
        "thing requires courage. Saying no to these practices does not mean a lack of respect for "
        "colleagues, clients or suppliers: it means protecting the trust that is at the foundation of our "
        "work.",
        S['body']))
    story.append(Paragraph("Understanding and complying with client codes of conduct", S['h3']))
    story.append(Paragraph(
        "Working as consultants at our clients' premises and on their systems, it is our responsibility "
        "to know and respect the client's code of conduct, in addition to this Code. There may be "
        "restrictions &mdash; on gifts, hospitality, physical or IT security, system and data access "
        "&mdash; that are stricter than ours: in such cases, we comply with those of the client.",
        S['body']))
    story.append(Paragraph(
        "When a client's code of conduct appears to conflict with our Code, we discuss it with the "
        "client and with Eurisko management. We seek to comply with the spirit and fundamental "
        "principles of the client's code, but always in compliance with our Code of Business Ethics and "
        "applicable laws.",
        S['body']))
    story.append(Paragraph("Cooperation with internal investigations", S['h3']))
    story.append(Paragraph(
        "We fully cooperate with all internal investigations initiated to ascertain possible violations of "
        "the Code. Even when the initial report is anonymous, it may be necessary to provide "
        "additional information to enable the facts to be established.",
        S['body']))
    story.append(Paragraph("Asking questions", S['h3']))
    story.append(Paragraph(
        "For any question about your responsibilities or the contents of this Code, contact your "
        "reporting line, the management, or the dedicated address indicated in the internal "
        "procedures. No question is trivial: asking first is always better than acting in doubt.",
        S['body']))
    story.append(PageBreak())

    # Page 6 — Making the right decisions
    story += section_header("J U D G E M E N T", "Making the right decisions")
    story.append(Paragraph(
        "Issues do not always have a clear and obvious solution. In difficult situations, use your "
        "judgement and involve others to help you make the right decisions.",
        S['body']))
    story.append(Spacer(1, 6))
    story.append(info_box(
        "H O W   T O",
        "Four questions before acting",
        [
            Paragraph("Not sure about a conduct or a decision? Ask yourself the following questions:", S['box_body']),
            Spacer(1, 6),
            bullets([
                "<b>Obligations under the law</b> &mdash; Could it be illegal?",
                "<b>Obligations to Eurisko</b> &mdash; Could it violate our values, the Code of Business Ethics or our policies?",
                "<b>Obligations to others</b> &mdash; Could it violate an obligation toward a client, a supplier or another partner (e.g. contracts, confidentiality agreements, client codes of conduct)?",
                "<b>Do no harm</b> &mdash; Could it harm someone, your personal reputation, or Eurisko's brand, reputation, financial performance or commercial relationships?",
            ]),
            Spacer(1, 6),
            Paragraph("If the answer to any of the above questions is &laquo;yes&raquo;, don't do it.", S['box_body']),
        ]))
    story.append(Spacer(1, 12))
    story.append(Paragraph(
        "If you have doubts, contact your manager, the management, or the company points of contact "
        "indicated in the internal procedures. If you do not feel comfortable asking questions or raising "
        "concerns through these channels, use the reporting channel described in the following "
        "section.",
        S['body']))
    story.append(PageBreak())

    # Page 7 — How to raise concerns
    story += section_header("S P E A K   U P", "How to raise concerns")
    story.append(Paragraph(
        "<i>Speak up if you experience first-hand or witness disrespectful, inappropriate, fraudulent, "
        "unethical or illegal conduct, including any retaliation.</i>",
        S['lede']))
    story.append(Paragraph(
        "There are several ways to report a concern and the most effective way depends on the nature "
        "of the concern itself. You can always make a report to your manager, to the management, to "
        "the Human Resources point of contact, or to the Supervisory Body established pursuant to "
        "Italian Legislative Decree 231/2001. If you do not receive an adequate response from the "
        "first source you turned to, you may always turn to another channel, without fear of retaliation.",
        S['body']))
    story.append(Paragraph(
        "Eurisko makes a dedicated channel available for reports of unlawful or irregular conduct, in "
        "compliance with Italian Legislative Decree 24/2023 (whistleblowing). The channel ensures "
        "the confidentiality of the identity of the reporter, the reported person and any other party "
        "involved, as well as the content of the report and related documentation. The operational "
        "procedures for accessing the channel are described in the dedicated company procedure.",
        S['body']))
    story.append(info_box(
        "P R O T E C T I O N   O F   T H E   R E P O R T E R",
        "Zero tolerance for retaliation",
        [
            Paragraph(
                "Eurisko applies a zero-tolerance policy toward retaliation against anyone making a "
                "report in good faith or cooperating with an internal investigation. Retaliation means any "
                "form of unfavourable treatment, whether explicit or implicit, adopted as a consequence "
                "of the report.",
                S['box_body']),
            Spacer(1, 6),
            Paragraph("The following are forbidden in particular:", S['box_body']),
            bullets([
                "Disciplinary sanctions, demotions, denial of promotions, unjustified transfers or dismissal.",
                "Adverse changes to working hours, compensation or assigned duties.",
                "Mobbing, isolation, intimidation, threats or any other form of pressure, even verbal or indirect.",
            ]),
            Spacer(1, 4),
            Paragraph(
                "<b>Retaliatory conduct is itself subject to disciplinary action and, where the conditions "
                "are met, to reporting to judicial authorities.</b>",
                S['box_body']),
        ]))
    story.append(PageBreak())

    # Page 8 — Six fundamental behaviours intro
    story.append(Spacer(1, 4 * cm))
    story.append(Paragraph("O U R   C O D E", S['big_section_eyebrow']))
    story.append(Paragraph("SIX", S['big_section_title']))
    story.append(Paragraph("FUNDAMENTAL", S['big_section_title']))
    story.append(Paragraph("BEHAVIOURS", S['big_section_title']))
    story.append(Spacer(1, 12))
    story.append(Paragraph(
        "Our Code of Business Ethics consists of six fundamental behaviours that apply to every one "
        "of us at all times.",
        S['lede']))
    story.append(PageBreak())

    # Page 9 — 01 Conduct matters
    story.append(Paragraph("01", S['num_marker']))
    story.append(Paragraph("CONDUCT MATTERS", S['behavior_title']))
    story.append(Paragraph(
        "Respect, availability and shared ethical values are at the heart of Eurisko's culture and are "
        "deeply rooted in our core values. The importance of conduct contributes to promoting these "
        "values and describes the behaviours we expect from and toward our people, so that they can "
        "do their best every day.",
        S['body']))
    story.append(Paragraph("Respect for the person", S['h3']))
    story.append(Paragraph("<i>Our interactions are guided by mutual respect.</i>", S['quote_em']))
    story.append(Paragraph(
        "Eurisko does not tolerate disrespectful behaviour, harassment or threats of any kind. It is not "
        "always relevant whether disrespectful or harassing conduct is intentional: what matters is how "
        "it is perceived by the person involved. If it is reasonably perceived as offensive, Eurisko "
        "prohibits such conduct. Disrespectful conduct can take many forms &mdash; behaviours that "
        "interfere with work performance or any other way of treating others that creates an "
        "intimidating, hostile or offensive environment.",
        S['body']))
    story.append(info_box(
        "E X A M P L E S",
        "What we mean by inappropriate conduct",
        [bullets([
            "Repeatedly raising your voice in public or in private, or using vulgar or degrading language toward a person or their work.",
            "Personal insults, humiliation or intimidation &mdash; including via email, Microsoft Teams messages, WhatsApp or other messaging tools.",
            "Bullying, mobbing, abusive behaviour or uncontrolled fits of anger toward a person.",
            "Spreading gossip with the intent to harm someone or persistent, unjustified or unnecessary attacks on another person's personal or professional life.",
            "Deliberate disrespect for cultural differences, deliberate exclusion from team activities, unwanted physical contact.",
            "Sexual harassment, in any form &mdash; verbal, written, physical or via digital content.",
        ])]))
    story.append(Spacer(1, 8))
    story.append(Paragraph(
        "We expect all Eurisko people, regardless of professional level or role, to treat colleagues, "
        "clients, suppliers and anyone else they meet in work contexts with respect.",
        S['body']))
    story.append(Paragraph("Meritocracy and non-discrimination", S['h3']))
    story.append(Paragraph("<i>We apply the principle of meritocracy in all decisions affecting our people.</i>", S['quote_em']))
    story.append(Paragraph(
        "All decisions relating to personnel &mdash; recruitment, hiring, compensation, training, "
        "assignment of duties, promotions, performance evaluations &mdash; must be based exclusively "
        "on individual contribution, demonstrated skills and business needs. Eurisko does not "
        "discriminate against any person on the basis of: age, sex, pregnancy or maternity, marital or "
        "family status, sexual orientation, gender identity or expression, race, ethnicity, national "
        "origin, religion, creed, political opinions, trade union membership, mental or physical "
        "disability, genetic data, or any other characteristic protected by law.",
        S['body']))
    story.append(PageBreak())

    # Page 10 — Conflicts of interest
    story.append(Paragraph("Resolving conflicts of interest", S['h3']))
    story.append(Paragraph(
        "<i>We make sure that our personal interests and relationships do not create conflicts for Eurisko.</i>",
        S['quote_em']))
    story.append(Paragraph(
        "A conflict of interest is a situation in which a person &mdash; or their family member, relative "
        "or friend &mdash; has personal interests that may influence their ability to act in Eurisko's best "
        "interest, or interfere with their obligations to the company.",
        S['body']))
    story.append(Paragraph(
        "Our company is built on trust-based relationships, and conflicts of interest risk undermining "
        "that trust. Failure to avoid or properly manage a conflict can have serious consequences "
        "both for Eurisko and for the person involved.",
        S['body']))
    story.append(info_box(
        "E X A M P L E",
        "Situations in which conflicts of interest may arise",
        [bullets([
            "Personal investments &mdash; one's own or those of family members &mdash; in companies with which Eurisko has business relationships (clients, suppliers, partners).",
            "External professional activities carried out in parallel, in particular in the same sector or for parties competing with Eurisko or its clients.",
            "Close family or personal relationships with people working at clients, suppliers or competitors, in particular if these people are involved in decisions concerning Eurisko.",
            "Starting one's own business in the same consulting area in which Eurisko operates.",
            "Using property, information or one's role at Eurisko to obtain personal advantage.",
        ])]))
    story.append(Spacer(1, 8))
    story.append(Paragraph("What to do in case of conflict", S['h3']))
    story.append(Paragraph(
        "We understand that conflicts of interest may occasionally arise during the normal course of "
        "business. The most important thing in such cases is to promptly report the situation to "
        "management, obtain the necessary approvals and comply with any restrictions indicated. "
        "Often a conflict is simple to resolve, especially when disclosed at the right time.",
        S['body']))
    story.append(PageBreak())

    # Page 11 — 02 Respect the law
    story.append(Paragraph("02", S['num_marker']))
    story.append(Paragraph("RESPECT THE LAW", S['behavior_title']))
    story.append(Paragraph(
        "We respect all applicable laws and regulations &mdash; local, national, European and "
        "international. Eurisko's people and those acting in its name are responsible for understanding "
        "the regulations applicable to their area of activity and for turning to management in case of "
        "doubt. Violations of the law can result in significant damages &mdash; sanctions, loss of "
        "business relationships, individual civil and criminal liability, severe reputational "
        "consequences.",
        S['body']))
    story.append(Paragraph("Organisation Model and Italian Legislative Decree 231/2001", S['h3']))
    story.append(Paragraph(
        "<i>We know and respect the Organisation, Management and Control Model adopted by Eurisko.</i>",
        S['quote_em']))
    story.append(Paragraph(
        "Eurisko adopts an Organisation, Management and Control Model pursuant to Italian "
        "Legislative Decree 231/2001 in order to prevent the commission, in the interest or for the "
        "benefit of the company, of the predicate offences provided for by the regulations. All those "
        "operating in the name or on behalf of Eurisko are required to know the Model, to respect its "
        "protocols, and to promptly report to the Supervisory Body any violations or suspected "
        "violations.",
        S['body']))
    story.append(Paragraph("Anti-corruption", S['h3']))
    story.append(Paragraph("<i>We neither pay nor accept bribes &mdash; in any form and for any reason.</i>",
                            S['quote_em']))
    story.append(Paragraph(
        "Eurisko's position is simple: corruption is wrong, it is against the law, and we do not pay or "
        "accept bribes. We comply with applicable anti-corruption laws &mdash; in particular Italian "
        "Law 190/2012, Article 2635 of the Italian Civil Code (private-to-private corruption) and the "
        "relevant provisions of Legislative Decree 231/2001 &mdash; without exception, even if our "
        "competitors adopt different behaviour.",
        S['body']))
    story.append(Paragraph(
        "We understand that client relationships are also cultivated through moments of socialising "
        "&mdash; lunches, events, small courtesies. Such activities are acceptable only if kept within "
        "reasonable and transparent boundaries, and may never be aimed at obtaining or granting an "
        "improper advantage.",
        S['body']))
    story.append(info_box(
        "H O W   T O",
        "Five criteria before offering or accepting a gift",
        [Paragraph("Before providing or accepting a gift, a meal, a form of entertainment or a trip, verify that it is:", S['box_body']),
         Spacer(1, 4),
         bullets([
            "1. Offered for a proper purpose and not aimed at obtaining an improper advantage or influencing the recipient.",
            "2. Permitted by applicable law.",
            "3. Permitted by Eurisko's internal policies and procedures.",
            "4. Permitted by the recipient's policies and the contractual agreements in place with their employer.",
            "5. Of reasonable value and proportionate to the circumstances and the professional relationship.",
         ]),
         Spacer(1, 4),
         Paragraph("If even one of these criteria is not met, the gift is inappropriate.", S['box_body'])
        ]))
    story.append(Paragraph("Privacy and personal data protection", S['h3']))
    story.append(Paragraph(
        "<i>We process and protect personal data in compliance with the GDPR and Italian privacy legislation.</i>",
        S['quote_em']))
    story.append(PageBreak())

    # Page 12 — continues 02
    story.append(Paragraph(
        "We comply with EU Regulation 2016/679 (GDPR), Italian Legislative Decree 196/2003 and "
        "further applicable provisions when we collect, store, use or transfer personal data &mdash; be "
        "they of colleagues, candidates, clients, suppliers or third parties.",
        S['body']))
    story.append(Paragraph(
        "We process personal data for lawful purposes, in a transparent and proportionate manner, "
        "ensuring access exclusively to those who actually need it to carry out their activities. We "
        "adopt appropriate technical and organisational measures to protect data from unauthorised "
        "access, loss or improper use. When we entrust processing to external suppliers, we make "
        "sure that they are contractually bound to respect the same standards.",
        S['body']))
    story.append(Paragraph(
        "We immediately report to management any suspected personal data breach, in order to "
        "allow the assessments and communications required by the regulations within the prescribed "
        "timeframes.",
        S['body']))
    story.append(Paragraph("Fair competition", S['h3']))
    story.append(Paragraph("<i>We are fierce competitors, but honest ones.</i>", S['quote_em']))
    story.append(Paragraph(
        "Eurisko pursues and concludes business exclusively on the basis of its own merits &mdash; "
        "quality of work, competence of people, value of proposed solutions. We do not collude or "
        "agree with competitors on prices, offer conditions, market or customer or opportunity sharing. "
        "Such practices violate competition laws and do not correspond to our way of working.",
        S['body']))
    story.append(Paragraph(
        "We do not improperly use confidential data of competitors, clients, suppliers or former "
        "employers. When a person joins Eurisko, they are asked not to bring with them documentation, "
        "code, configurations or other confidential materials belonging to the previous employer, and "
        "to respect any non-compete or confidentiality obligations still in force.",
        S['body']))
    story.append(PageBreak())

    # Page 13 — 03 Create value for clients
    story.append(Paragraph("03", S['num_marker']))
    story.append(Paragraph("CREATE VALUE FOR OUR CLIENTS", S['behavior_title']))
    story.append(Paragraph(
        "Regardless of our role, we are all in the service of Eurisko's clients, focusing on the client's "
        "true interests while acting as ambassadors of the company. The principle <i>\"We are customer "
        "centric\"</i> is not a slogan: it is the operating rule that guides every technical, "
        "methodological and behavioural choice we make.",
        S['body']))
    story.append(Paragraph("Innovation, value and results", S['h3']))
    story.append(Paragraph("<i>We deliver pragmatic innovation and focus on value and results.</i>", S['quote_em']))
    story.append(Paragraph(
        "At Eurisko we bring concrete innovation to our clients &mdash; adapting quickly to change "
        "and proposing solutions built on the client's real processes. We develop and maintain "
        "lasting relationships, founded on integrity, transparency, trust and proven results.",
        S['body']))
    story.append(Paragraph(
        "Sometimes, to build a solid relationship with the client, difficult conversations are necessary. "
        "Acting in the client's best interest does not mean saying yes to every request: it means "
        "having the courage, when necessary, to indicate alternative solutions or to challenge an "
        "approach that does not generate value. The <i>\"We win together\"</i> principle also implies "
        "this: mutual respect, technical honesty, and shared responsibility for the result.",
        S['body']))
    story.append(Paragraph("Achieving excellence", S['h3']))
    story.append(Paragraph(
        "<i>We commit only to what we can deliver and we respect the contractual commitments we make.</i>",
        S['quote_em']))
    story.append(Paragraph(
        "Before making a commitment to a client, we honestly assess the scope of our activities, the "
        "skills required, the timelines and the risks of the project. We involve the right people &mdash; "
        "functional, technical, development &mdash; so that the final decision is informed and "
        "sustainable. We proactively identify risks and potential conflicts, and we manage them before "
        "making commitments.",
        S['body']))
    story.append(Paragraph(
        "When we enter into a contractual relationship with a client or another partner &mdash; "
        "supplier, alliance partner, freelancer &mdash; we fully understand the commitments made and "
        "we respect them. We accurately document activities, deliverables and timelines, and we "
        "promptly report any deviations.",
        S['body']))
    story.append(Paragraph("Confidentiality and protection of client information", S['h3']))
    story.append(Paragraph(
        "<i>The information the client entrusts us with is at the heart of our professional responsibility.</i>",
        S['quote_em']))
    story.append(Paragraph(
        "Working as consultants, we access data and information that represent our clients' strategic "
        "assets &mdash; financial data, master data, bills of materials, price lists, system "
        "configurations, custom ABAP code, business processes, transformation plans. We treat all "
        "this information as strictly confidential, even in the absence of an explicit confidentiality "
        "marking.",
        S['body']))
    story.append(info_box(
        "H O W   T O",
        "Practical confidentiality rules in daily work",
        [bullets([
            "We use client information exclusively for the purposes of the current project. We do not use it for other projects, for other clients, nor for personal purposes.",
            "We do not share client information with colleagues, family members, acquaintances or third parties who do not have an actual need to know for the purposes of the project.",
        ])]))
    story.append(PageBreak())

    # Page 14 — continues 03
    story.append(info_box(
        "H O W   T O   (continued)",
        "Practical confidentiality rules in daily work",
        [bullets([
            "We do not discuss project matters in public places (trains, airports, restaurants, lifts) where others may listen.",
            "We do not duplicate client data, configurations or developments on unauthorised devices or media, and we do not transfer them outside the client's systems without explicit authorisation.",
            "When a project ends &mdash; or when a person leaves a team or the company &mdash; we return or destroy all client materials in our possession, according to agreed procedures.",
            "We respect non-disclosure agreements (NDAs) signed with the client, even beyond the duration of the contractual relationship.",
        ])]))
    story.append(Spacer(1, 12))
    story.append(Paragraph("Adherence to client codes of conduct", S['h3']))
    story.append(Paragraph(
        "When we operate at a client's premises or on a client's systems, we know and respect the "
        "client's rules &mdash; code of conduct, IT security policy, system access procedures, "
        "password and certificate management, rules of use for email and collaboration tools. When "
        "the client's rules are more restrictive than ours, we apply the client's. When they conflict "
        "with our Code or with the law, we discuss it immediately with management.",
        S['body']))
    story.append(Paragraph("Collaboration within our network", S['h3']))
    story.append(Paragraph(
        "At Eurisko we collaborate and share knowledge within the team to grow skills, generate "
        "innovation and deliver value to clients &mdash; while at the same time protecting the data "
        "and intellectual property of Eurisko and the clients themselves. We commit to delivering "
        "consistent results, through disciplined execution and the use of established methods.",
        S['body']))
    story.append(PageBreak())

    # Page 15 — 04 Protect people, info, company
    story.append(Paragraph("04", S['num_marker']))
    story.append(Paragraph("PROTECT PEOPLE, INFORMATION AND THE COMPANY", S['behavior_title']))
    story.append(Paragraph(
        "We work together to build a solid and stable company, protecting the Eurisko brand, "
        "respecting our commitments to data and intellectual property protection, acting with an "
        "entrepreneurial mindset and taking care of our people.",
        S['body']))
    story.append(Paragraph("Information security", S['h3']))
    story.append(Paragraph(
        "<i>We protect Eurisko's, clients' and other parties' confidential data from unauthorised use or "
        "disclosure.</i>",
        S['quote_em']))
    story.append(Paragraph(
        "When we receive confidential information &mdash; from a client, a supplier, a colleague, a "
        "partner &mdash; we understand our legal and contractual obligations and abide by them. If we "
        "are not sure whether information is confidential, we treat it as if it were.",
        S['body']))
    story.append(Paragraph(
        "We use confidential data exclusively for the purpose for which it was shared. Once that "
        "purpose is achieved, we destroy confidential data that does not belong to Eurisko, unless "
        "otherwise required by law or contract. We share confidential information only with authorised "
        "persons with an actual need to know, and only after verifying that the necessary "
        "confidentiality agreements are in place.",
        S['body']))
    story.append(info_box(
        "H O W   T O",
        "Basic practices for data security",
        [bullets([
            "We use company computers or client-provided ones for work activities &mdash; never unauthorised personal devices to handle Eurisko or client data.",
            "We do not install software or modify configurations that could compromise the security of company devices or client devices.",
            "We do not use cloud services, file-sharing or third-party web tools (Dropbox, personal Google Drive, WeTransfer, ChatGPT, etc.) to handle Eurisko or client data, unless such tools have been explicitly approved for that use.",
            "We protect system access with strong passwords and multi-factor authentication where available. We do not share credentials with anyone.",
            "We lock devices when we step away, even briefly, and especially when working at the client or in public spaces.",
            "We immediately report to management any suspected breach, loss or theft of devices, unauthorised access or significant anomaly.",
        ])]))
    story.append(Spacer(1, 10))
    story.append(Paragraph("Intellectual property", S['h3']))
    story.append(Paragraph(
        "<i>We protect and respect the intellectual property rights of others, and safeguard those of "
        "Eurisko and its clients.</i>",
        S['quote_em']))
    story.append(Paragraph(
        "Intellectual property is particularly relevant in our technology consulting work: custom ABAP "
        "code, SAP configurations, data models, process mappings, functional documentation, "
        "delivery methodologies are all valuable assets. Their correct management is an individual "
        "responsibility of each of us.",
        S['body']))
    story.append(PageBreak())

    # Page 16 — continues 04
    story.append(Paragraph(
        "We respect the intellectual property rights of clients, suppliers, former employers and any "
        "other party. We do not use, distribute, copy or bring into Eurisko documents, code or "
        "confidential materials from a previous employer or other parties &mdash; even if we personally "
        "authored such materials, and even if they do not contain apparently sensitive data. Likewise, "
        "we do not remove client materials from their systems or premises without written "
        "authorisation.",
        S['body']))
    story.append(Paragraph(
        "We do not download or use copyright-protected materials &mdash; software, source code, "
        "images, content &mdash; without the proper licence. The availability of material on the "
        "internet does not imply the right to use it freely.",
        S['body']))
    story.append(Paragraph("Use of company technology", S['h3']))
    story.append(Paragraph(
        "The technology provided by Eurisko is primarily intended for work activity. Limited and "
        "responsible personal use is permitted but must remain proportionate and not interfere with "
        "work or system security. We do not use client-provided devices for Eurisko internal activities "
        "or for personal use, and conversely we do not handle client data on unauthorised devices.",
        S['body']))
    story.append(Paragraph("Social media", S['h3']))
    story.append(Paragraph(
        "<i>We participate in online discussions with the common sense we would use in any "
        "professional context.</i>",
        S['quote_em']))
    story.append(Paragraph(
        "When we publish content on LinkedIn, on other social networks, on blogs or on professional "
        "communities, we represent &mdash; even indirectly &mdash; Eurisko. We communicate by "
        "thinking carefully about what we are about to write, and we never post disrespectful, harassing, "
        "discriminatory content or content that could damage the reputation of Eurisko, our clients or "
        "our colleagues.",
        S['body']))
    story.append(info_box(
        "G U I D E L I N E S",
        "When you post on social media",
        [bullets([
            "We do not identify a company as an Eurisko client unless we have been explicitly authorised to do so. The presence of a client in our portfolio is itself information that may be confidential.",
            "We protect non-public information related to projects, development activities, clients and partners. We do not post screenshots of systems, code, configurations or project documentation.",
            "When we express professional opinions, we should clarify that they are personal opinions and not official Eurisko positions, unless we have been authorised to speak on behalf of the company.",
            "We do not respond to press, industry analyst or researcher inquiries on our own: such inquiries are handled by management.",
            "We respect the privacy of others: we do not post photos, names or information about colleagues, clients or suppliers without their consent.",
        ])]))
    story.append(Spacer(1, 10))
    story.append(Paragraph("Brand", S['h3']))
    story.append(Paragraph(
        "The Eurisko name and brand are highly valuable assets, built over time. Our daily behaviours, "
        "inside and outside the company, contribute to their meaning. All communications addressed "
        "to the media, industry analysts, institutions or the public in the name of Eurisko are "
        "coordinated by management, to ensure consistency and accuracy.",
        S['body']))
    story.append(Paragraph("Workplace safety", S['h3']))
    story.append(Paragraph("<i>Personal safety is a priority.</i>", S['quote_em']))
    story.append(Paragraph(
        "Eurisko is committed to providing a safe working environment, both at its own premises and "
        "at client premises. We respect all applicable safety and emergency procedures &mdash; "
        "including those provided by Italian Legislative Decree 81/2008 (Consolidated Health and "
        "Safety at Work Act) &mdash; and we promptly report",
        S['body']))
    story.append(PageBreak())

    # Page 17 — continues 04 closing
    story.append(Paragraph(
        "situations that may constitute a risk to people, to work continuity or to client systems.",
        S['body']))
    story.append(PageBreak())

    # Page 18 — 05 Conduct business responsibly
    story.append(Paragraph("05", S['num_marker']))
    story.append(Paragraph("CONDUCT BUSINESS ACTIVITIES RESPONSIBLY", S['behavior_title']))
    story.append(Paragraph(
        "We are proactive, we strive for quality results, acting as entrepreneurs and owners of the "
        "work we do. We use common sense to make decisions within our authority, recognising its "
        "limits and asking for advice when a situation requires broader judgement. We spend Eurisko's "
        "resources as if they were our own &mdash; with care, responsibility and transparency.",
        S['body']))
    story.append(Paragraph("Responsible use of data and new technologies", S['h3']))
    story.append(Paragraph(
        "<i>We use data and new technologies &mdash; including artificial intelligence &mdash; "
        "responsibly.</i>",
        S['quote_em']))
    story.append(Paragraph(
        "Data is a valuable asset and a resource for new technologies. Our clients entrust us with the "
        "processing of their data, including that of their employees and their own clients. We take very "
        "seriously our role as data custodians: in addition to complying with privacy regulations, we "
        "use data and technologies ethically, evaluating the implications of the technical choices we "
        "propose.",
        S['body']))
    story.append(Paragraph(
        "When we use generative artificial intelligence tools in our work, we take responsibility for "
        "verifying the output before using it. We do not enter confidential Eurisko or client data into "
        "such tools, unless the tool has been explicitly approved for that use and there are contractual "
        "guarantees on data protection. We declare, when required, the use of AI tools in our "
        "deliverables.",
        S['body']))
    story.append(Paragraph("Financial reporting and corporate documentation", S['h3']))
    story.append(Paragraph(
        "<i>We prepare and provide complete, accurate and timely financial and operational "
        "information.</i>",
        S['quote_em']))
    story.append(Paragraph(
        "Eurisko fulfils its obligations to maintain accounting records, prepare financial statements "
        "and transmit information required by the competent authorities, in compliance with the "
        "Italian Civil Code, tax regulations and applicable provisions. Financial information is based "
        "on accurate documentation: accounting records, customer invoices and supplier invoices, "
        "time reporting and expense reporting.",
        S['body']))
    story.append(Paragraph(
        "We retain corporate documentation according to the archiving procedures and timeframes "
        "required by applicable regulations and existing contracts. When an investigation, dispute or "
        "audit is in progress or anticipated, we do not destroy, modify or hide relevant documents.",
        S['body']))
    story.append(Paragraph("Time and expense reporting", S['h3']))
    story.append(Paragraph(
        "<i>We accurately report working hours and submit accurate and valid expense reports within "
        "the established deadlines.</i>",
        S['quote_em']))
    story.append(Paragraph(
        "In our consulting model, time reporting has a direct impact on client invoicing, on Eurisko's "
        "financial results and on the reliability of the professional relationship. Each of us has the "
        "responsibility to record the hours actually worked, to use the correct project and activity "
        "codes, and to respect monthly closing deadlines.",
        S['body']))
    story.append(info_box(
        "E X P E C T A T I O N S",
        "What we expect from each one",
        [Paragraph("(continues on next page)", S['box_body'])]
        ))
    story.append(PageBreak())

    # Page 19 — continues 05
    story.append(info_box(
        "E X P E C T A T I O N S",
        "What we expect from each one",
        [bullets([
            "We record working hours in the company system within the established deadlines, in an accurate and truthful way &mdash; without opportunistic rounding, without shifting between projects, without compensation across periods.",
            "We do not ask or suggest to anyone &mdash; junior colleagues, collaborators, suppliers &mdash; to report hours inaccurately or untruthfully.",
            "We submit expense reports with complete supporting documentation, in compliance with company policies on caps and types of reimbursable expenses.",
            "We do not include in expense reports costs not incurred or not attributable to work purposes.",
            "Those who review and approve third-party reports verify them carefully, flagging anomalies and inconsistencies.",
        ])]))
    story.append(Spacer(1, 10))
    story.append(Paragraph("Business travel and mobility", S['h3']))
    story.append(Paragraph(
        "Business travel is an integral part of our consulting activity. We organise it efficiently &mdash; "
        "balancing project needs, costs, timelines and environmental impact &mdash; and in "
        "compliance with company policies. When possible, we evaluate virtual alternatives (online "
        "meetings, remote sessions) as effective substitutes for physical travel, both for sustainability "
        "reasons and to better manage personal and professional time.",
        S['body']))
    story.append(Paragraph("Procurement and supplier management", S['h3']))
    story.append(Paragraph(
        "We purchase goods and services based on their value &mdash; quality, price, performance, "
        "technical suitability, supplier reliability. Purchasing decisions are made by those who have the "
        "mandate to do so, according to company procedures. We do not choose suppliers merely "
        "because they are also clients, nor do we carry out transactions that may appear ambiguous "
        "or that may distort the accounting representation.",
        S['body']))
    story.append(Paragraph(
        "We select suppliers and external collaborators &mdash; including freelance consultants and "
        "subcontractors &mdash; who operate according to principles consistent with our Code and "
        "applicable regulations (in particular labour, tax, occupational safety and data protection law). "
        "When necessary, we provide for formal adherence to the principles of the Code as part of "
        "contractual agreements.",
        S['body']))
    story.append(PageBreak())

    # Page 20 — 06 Be a good citizen
    story.append(Paragraph("06", S['num_marker']))
    story.append(Paragraph("BE A GOOD CITIZEN", S['behavior_title']))
    story.append(Paragraph(
        "We support and respect human rights, promote environmental responsibility and encourage "
        "our people's engagement in the communities in which they live and work. We believe that the "
        "way a company relates to the context in which it operates is an integral part of its long-term "
        "success.",
        S['body']))
    story.append(Paragraph("Human rights", S['h3']))
    story.append(Paragraph("<i>We support and respect human rights.</i>", S['quote_em']))
    story.append(Paragraph(
        "We adhere to the principles of the International Bill of Human Rights and of the International "
        "Labour Organization (ILO) Declaration on Fundamental Principles and Rights at Work. We "
        "focus our attention on the areas most relevant to our activities:",
        S['body']))
    story.append(bullets([
        "<b>Diversity and equal opportunities</b> &mdash; We are committed to eliminating any form of discrimination in access to and performance of work, applying the principle of meritocracy consistently.",
        "<b>Working conditions and labour relations</b> &mdash; We ensure a respectful working environment. We respect our people's right to freely form or join representative bodies, and to engage with them in good faith.",
        "<b>Health and safety</b> &mdash; We ensure health and safety for our people, in compliance with Italian Legislative Decree 81/2008 and further applicable provisions.",
        "<b>Supply chain</b> &mdash; We commit to working with suppliers and collaborators who share the same ethical standards and protections.",
        "<b>Privacy</b> &mdash; We protect personal data and process it responsibly, as described in the previous sections.",
    ]))
    story.append(Spacer(1, 10))
    story.append(Paragraph("Environmental responsibility", S['h3']))
    story.append(Paragraph("<i>We promote environmentally sustainable economic growth.</i>", S['quote_em']))
    story.append(Paragraph(
        "We seek to reduce the environmental impact of our activities through concrete choices: "
        "efficient use of energy resources and materials at our office, reduction of physical travel when "
        "virtual meetings are equally effective, responsible management of electronic devices and "
        "technological waste.",
        S['body']))
    story.append(Paragraph(
        "We encourage our people, our clients and our suppliers to do the same, sharing experiences "
        "and best practices.",
        S['body']))
    story.append(Paragraph("Community impact", S['h3']))
    story.append(Paragraph(
        "We support Eurisko people who choose to dedicate their time, skills or resources to volunteer "
        "initiatives, training, mentorship or support for the communities in which we live. We believe "
        "that sharing technical and professional skills &mdash; especially toward young people, "
        "students and organisations operating in contexts of fragility &mdash; is one of the most "
        "concrete ways in which a consulting firm can contribute to its territory.",
        S['body']))
    story.append(PageBreak())

    # Page 21 — Thank you
    story.append(Spacer(1, 6 * cm))
    story.append(Paragraph("Thank you.", S['footer_thanks_big']))
    story.append(Paragraph(
        "For your daily commitment to doing the right thing.", S['footer_thanks_sub']))
    story.append(Spacer(1, 4 * cm))
    story.append(Paragraph(
        '<para align="center"><b>Eurisko S.r.l.</b><br/>'
        'Via Burolo, 1 &mdash; 10010 Cascinette d\'Ivrea (TO) &mdash; Italy<br/>'
        'VAT 08407400012  ·  info@euriskosrl.it<br/>'
        '2026 Edition</para>',
        S['toc_entry']))

    return story


def build_pdf(output_path):
    doc = SimpleDocTemplate(
        output_path,
        pagesize=A4,
        leftMargin=2 * cm, rightMargin=2 * cm,
        topMargin=2 * cm, bottomMargin=2 * cm,
        title="Code of Business Ethics - Eurisko",
        author="Eurisko S.r.l.",
        subject="Code of Business Ethics",
    )
    story = build_story()

    # Use a multi-build to handle cover page differently
    doc.build(story, onFirstPage=cover_page, onLaterPages=header_footer)


if __name__ == "__main__":
    build_pdf("Code_of_Business_Ethics_Eurisko.pdf")
    print("PDF created: Code_of_Business_Ethics_Eurisko.pdf")
