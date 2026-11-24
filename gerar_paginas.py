# Gera as páginas individuais dos imóveis (rodar: python gerar_paginas.py)
import json, urllib.parse
WA="5538999643928"
CDN="https://imgs1.cdn-imobibrasil.com.br/imagens/imoveis/"
imoveis=[
 dict(slug="sala-comercial-edificio-athenas", codigo="202505",
  titulo="Sala Comercial 603 – Edifício Athenas", local="Centro · Montes Claros – MG",
  preco="R$ 220.000", preco_de="R$ 250.000", desconto="12%", tipo="Sala comercial",
  specs=[("Área privativa","53 m²"),("Andar","6º"),("Banheiro","1"),("Localização","Centro")],
  desc=["Sala comercial no 6º andar do Edifício Athenas (Athenas Max Center), no Centro de Montes Claros.",
        "São 53 m² privativos com divisória em drywall que cria uma recepção/sala de espera independente, além de banheiro privativo. Ideal para consultório, escritório de advocacia, contabilidade ou investimento para locação."],
  itens=["Divisória em drywall para recepção","Banheiro privativo","6º andar","Localização central"],
  fotos=[f"fotos/sala-athenas/sala-603-{i:02d}.jpg" for i in [2,1]+list(range(3,16))]),
 dict(slug="lote-terras-alphaville", codigo="202503",
  titulo="Lote em Condomínio Fechado – Terras Alphaville", local="Residencial Terras Alphaville · Montes Claros – MG",
  preco="R$ 260.000", preco_de="R$ 300.000", desconto="13%", tipo="Lote em condomínio",
  specs=[("Área total","334,80 m²"),("Tipo","Lote residencial"),("Condomínio","Fechado"),("Bairro","Terras Alphaville")],
  desc=["Lote de 334,80 m² no Residencial Terras Alphaville, condomínio fechado em Montes Claros.",
        "Oportunidade para construir sua casa de médio ou alto padrão dentro de condomínio fechado, ou para investir."],
  itens=["Condomínio fechado","334,80 m² de área total"],
  fotos=[CDN+"202503162231542312.jpg",CDN+"202503162232032728.jpg"]),
]
tpl=open("_modelo_imovel.html",encoding="utf-8").read()
for im in imoveis:
    msg=f"Olá, Ruy! Vi no site o imóvel {im['titulo']} (cód. {im['codigo']}) e gostaria de mais informações."
    wa=f"https://wa.me/{WA}?text="+urllib.parse.quote(msg)
    specs="".join(f'<div class="spec"><span>{a}</span><strong>{b}</strong></div>' for a,b in im["specs"])
    desc="".join(f"<p>{p}</p>" for p in im["desc"])
    itens="".join(f"<li>{x}</li>" for x in im["itens"])
    thumbs="".join(f'<img src="{f}" alt="Foto {i+1}" loading="lazy" data-i="{i}" />' for i,f in enumerate(im["fotos"]))
    preco_html=im["preco"]
    if im.get("preco_de"):
        preco_html=f'<span class="selo-desconto">Preço reduzido · -{im["desconto"]}</span><span class="preco-de">De {im["preco_de"]}</span><span class="preco-por">Por {im["preco"]}</span>'
    html=(tpl.replace("{{PRECO_HTML}}",preco_html).replace("{{TITULO}}",im["titulo"]).replace("{{LOCAL}}",im["local"]).replace("{{PRECO}}",im["preco"])
      .replace("{{CODIGO}}",im["codigo"]).replace("{{TIPO}}",im["tipo"]).replace("{{SPECS}}",specs).replace("{{DESC}}",desc)
      .replace("{{ITENS}}",itens).replace("{{THUMBS}}",thumbs).replace("{{FOTO1}}",im["fotos"][0])
      .replace("{{FOTOS_JSON}}",json.dumps(im["fotos"])).replace("{{WA}}",wa))
    open(f"imovel-{im['slug']}.html","w",encoding="utf-8").write(html)
    print("ok",im["slug"])
