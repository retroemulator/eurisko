# -*- coding: utf-8 -*-
import io, os
def rd(p): return io.open(p,'r',encoding='utf-8',newline='').read()
def wr(p,t): io.open(p,'w',encoding='utf-8',newline='').write(t)
def sub(t, a, b, label, rep):
    if a in t:
        rep[label]=rep.get(label,0)+t.count(a); return t.replace(a,b)
    return t

rep={}

# ---- FORMS ----
forms = {
  'contatti.html': 'https://formsubmit.co/info@euriskosrl.it',
  'en/contact.html': 'https://formsubmit.co/info@euriskosrl.it',
  'lavora-con-noi.html': 'https://formsubmit.co/careers@euriskosrl.it',
  'en/careers.html': 'https://formsubmit.co/careers@euriskosrl.it',
}
for path, endpoint in forms.items():
    if not os.path.exists(path): print('MISS file', path); continue
    t=rd(path)
    t=sub(t,'https://formspree.io/f/xqewjkdn', endpoint, 'action', rep)
    t=sub(t,'https://formspree.io/f/mvzdygqp', endpoint, 'action', rep)
    t=sub(t,'name="_gotcha"','name="_honey"','honeypot',rep)
    t=sub(t,'name="_language" value="it">','name="_captcha" value="false">','captcha',rep)
    t=sub(t,'name="_language" value="en">','name="_captcha" value="false">','captcha',rep)
    t=t.replace('Form Formspree','Form FormSubmit').replace('Anti-spam Formspree honeypot','Anti-spam FormSubmit honeypot')
    wr(path,t)

# ---- CSP (vercel.json) ----
p='vercel.json'; t=rd(p)
t=sub(t,"form-action 'self' https://formspree.io","form-action 'self' https://formsubmit.co",'csp',rep)
wr(p,t)

# ---- COOKIE POLICY ----
ck_it_a='<li><strong>Formspree Inc.</strong> — servizio per l\'invio del modulo di contatto. Per dettagli: <a href="https://formspree.io/legal/privacy-policy/" target="_blank" rel="noopener noreferrer">Privacy Policy Formspree</a>.</li>'
ck_it_b='<li><strong>FormSubmit (formsubmit.co)</strong> — servizio per l\'invio dei moduli di contatto e candidatura (il CV viene recapitato via email). Per dettagli: <a href="https://formsubmit.co/" target="_blank" rel="noopener noreferrer">FormSubmit</a>.</li>'
ck_en_a='<li><strong>Formspree Inc.</strong> — service used for the contact form submission. For details: <a href="https://formspree.io/legal/privacy-policy/" target="_blank" rel="noopener noreferrer">Formspree Privacy Policy</a>.</li>'
ck_en_b='<li><strong>FormSubmit (formsubmit.co)</strong> — service used for the contact and job application form submissions (the CV is delivered by email). For details: <a href="https://formsubmit.co/" target="_blank" rel="noopener noreferrer">FormSubmit</a>.</li>'
for p,a,b in [('cookie-policy.html',ck_it_a,ck_it_b),('en/cookie-policy.html',ck_en_a,ck_en_b)]:
    t=rd(p); t=sub(t,a,b,'cookie',rep); wr(p,t)

# ---- PRIVACY ----
pr=[
 ('privacy.html','<li><strong>Formspree Inc.</strong> (USA) — fornitore del servizio di gestione del modulo di contatto, che agisce in qualità di responsabile esterno del trattamento.</li>',
  '<li><strong>FormSubmit (formsubmit.co)</strong> — fornitore del servizio di gestione dei moduli (contatto e candidature, incluso l\'allegato CV), che agisce in qualità di responsabile esterno del trattamento.</li>'),
 ('privacy.html','(in particolare Formspree e Vercel)','(in particolare FormSubmit e Vercel)'),
 ('en/privacy.html','<li><strong>Formspree Inc.</strong> (USA) — provider of the contact form management service, acting as external data processor.</li>',
  '<li><strong>FormSubmit (formsubmit.co)</strong> — provider of the form management service (contact and job applications, including the CV attachment), acting as external data processor.</li>'),
 ('en/privacy.html','(in particular Formspree and Vercel)','(in particular FormSubmit and Vercel)'),
]
for p,a,b in pr:
    t=rd(p); t=sub(t,a,b,'privacy',rep); wr(p,t)

print('Sostituzioni:', rep)
# verifica residui Formspree (escluso search-index)
res=[]
for dp,_,fs in os.walk('.'):
    if os.sep+'.git' in dp: continue
    for nm in fs:
        if nm.endswith(('.html','.json')) and nm!='search-index.json':
            if 'ormspree' in rd(os.path.join(dp,nm)): res.append(os.path.relpath(os.path.join(dp,nm),'.'))
print('Residui Formspree (no search-index):', res)
